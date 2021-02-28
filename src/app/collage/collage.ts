import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle, toDataURL } from "./util";
import { environment } from './../../environments/environment';
import ImageBox from "./image-box"
import CanvasContextMenu from "./contextmenu"

@Injectable({
  providedIn: "root",
})
export class Collage {
  private canvas: fabric.Canvas;
  private loading: boolean = false;
  private layout: CanvasLayout
  private contextMenu: CanvasContextMenu
  private images: any = {}
  private selectedTag: any
  private savedCollage: any
  private menuPoint: any
  private dropImageUrl: string
  
  onLoadingStateChanged: Function;
  onMenuItemClicked: Function;

  constructor(private api: ApiService, private setting: Setting) {
    this.contextMenu = new CanvasContextMenu()
    this.contextMenu.onMenuItemClicked = (e) => this.onMenuItemClicked(e)
    window.addEventListener('resize', () => this.resizeCanvas(), false);
  }

  private setLoadingState(state) {
    this.loading = state;
    this.onLoadingStateChanged && this.onLoadingStateChanged(state);
  }

  private createCanvasElement(width, height) {
    const container = document.getElementById("canvas-container");
    var element = document.createElement("canvas");
    element.id = "main-canvas";
    element.width = width;
    element.height = height;
    element.style.position = "absolute";
    element.style.border = "0px";
    container.appendChild(element);
  }

  private removeCanvasElement() {
    const container = document.getElementById("canvas-container");
    if (container.childNodes.length > 0) {
      container.removeChild(container.childNodes[0]);
    }
  }

  private getCanvasContainerWidth() {
    return document.getElementById("canvas-container").offsetWidth;
  }

  //////////////////////////////////////////////////////
  //Create Auto Collage
  //////////////////////////////////////////////////////
  async createAutoCollage() {
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(this.setting, ccw)

      this.savedCollage = null
      this.removeCanvasElement()
      this.setLoadingState(true);

      let res = await this.api.getImageList();
      if (!res || !res.images || !res.images.length) {
        return
      }

      const shuffledImages = shuffle(res.images);
      const images = await Promise.all(shuffledImages.map(async (item) => {
          const image = await loadImage(item.src);
          return Object.assign(item, {
            image: image,
            ratio: image['width'] / image['height'],
          });
        })
      )
      console.log("LoadImage, Completed")

      // Get perfect layouts
      const canvasWidth = this.layout.calculateWidth();
      const perfectRows = this.layout.getCanvasLayout(images);
      const layoutItems = this.layout.getLayoutItems(images, perfectRows, canvasWidth, this.setting.borderWidth);
      const sumOfHeight = layoutItems.reduce((accumulator, item) => {
        return Math.max(accumulator, item.top + item.height);
      }, 0);

      // Create canvas and fabric
      const canvasHeight = this.setting.borderWidth + sumOfHeight
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)

      // Add images to canvas.
      this.images = []
      layoutItems.forEach(data => {
        const tag = `img_${data.col}_${data.row}`
        this.images[tag] = new ImageBox(this.canvas)
          .setTag(tag)
          .setBorder(this.setting.borderWidth, this.setting.borderColor)
          .setImageUrl(data.img.src)
          .loadImage(data.img.src)
          .addMovableBoard(data.left, data.top, data.width, data.height)
      })

      /*let data = layoutItems[0]
      new ImageBox(this.canvas)
        .setTag("tag")
        .setBorder(0, setting.borderColor)
        .setImageUrl(data.img.src)
        .loadImage(data.img.src)
        .addMovableBoard(data.left, data.top, data.width, data.height)

        new ImageBox(this.canvas)
        .setTag("tag")
        .setBorder(10, setting.borderColor)
        .setImageUrl(data.img.src)
        .loadImage(data.img.src)
        .addMovableBoard(data.left, 400, data.width, data.height)*/
    }
    catch (err) {
      console.log(err)
    }
    finally {
      this.setLoadingState(false);
    }
  }

  createTemplate() {
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(this.setting, ccw)

      this.images = []
      this.savedCollage = null
      this.removeCanvasElement()

      const canvasWidth = this.layout.calculateWidth();
      const canvasHeight = canvasWidth * this.setting.heightInch / this.setting.widthInch;
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)

      const margin = this.setting.margin
      const width = (this.canvas.width - margin) / this.setting.cells
      const height = (this.canvas.height - margin) / this.setting.cells
      for (let i = 0; i < this.setting.cells; i++) {
        for (let j = 0; j < this.setting.cells; j++) {
          const left = margin + i * width
          const top = margin + j * height
          const cell = this.addCellWithPos(left, top, width - margin, height - margin)
          cell.cellRowIndex = i
          cell.cellColIndex = j
          cell.cellMargin = margin
          cell.onCellScaling = (cell) => this.onCellScaling(cell)        
        }
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  private createFabricCanvas(width, height) {
    if (this.canvas) {
      this.canvas.dispose()
    }

    this.canvas = new fabric.Canvas("main-canvas", {
      fireRightClick: true,
      stopContextMenu: true,
      selection: false,
      width: width,
      height: height,
      backgroundColor: '#ddd',
    })

    let touchTimestamp = 0
    this.canvas.on('mouse:down', (event) => {
      if (event.button === 1) {
        this.contextMenu.hideMenu()
      }
      touchTimestamp = event.e.timeStamp
    })

    this.canvas.on('mouse:up', (event) => {
      if (event.button === 3) {
        this.createContextMenu(event)
      }
      else if (event.e.type == "touchend") {
        if (event.e.timeStamp - touchTimestamp >= 300) {
          touchTimestamp = 0
          this.createContextMenu(event)
        }
      }
    })
  }

  private createContextMenu(event) {
    var pointer = this.canvas.getPointer(event.e);
    this.menuPoint = pointer

    const el = document.getElementById('main-canvas')
    var viewportOffset = el.getBoundingClientRect();

    var px = viewportOffset.x + pointer.x;
    var py = viewportOffset.y + pointer.y;

    if (event.target) {
      this.selectedTag = event.target.type          
      this.contextMenu.createMenu("#menu-image-edit", px, py)
    }
    else {
      this.contextMenu.createMenu("#menu-template", px, py)
    }
  }

  getSelectedImage() {
    return this.images[this.selectedTag]
  }

  private getImage(offsetX, offsetY) {
    for (var tag in this.images) {
      const it: ImageBox = this.images[tag]
      if (it.containsPoint(offsetX, offsetY)) {
        return it
      }
    }
    return null
  }

  deleteSelectedImage() {
    const box: ImageBox = this.getSelectedImage()
    box.removeImage()
    if (!box.lockBoardRect) {
      box.removeBoard()
      delete this.images[box.tag]
    }
  }

  private cellIndex: number = 0
  addCell() {
    this.addCellWithPos(this.menuPoint.x, this.menuPoint.y, 320, 320)
  }

  addCellWithPos(left, top, width, height) {
    this.cellIndex++
    const tag = "cell_" + this.cellIndex
    const cell = new ImageBox(this.canvas)
      .setTag(tag)
      .setBorder(this.setting.borderWidth, this.setting.borderColor)
      .addCellBoard(left, top, width, height)
    this.images[tag] = cell
    return cell
  }

  deleteCell() {
    const cell: ImageBox = this.getSelectedImage()
    cell.removeBoard()
    delete this.images[cell.tag]
  }

  onImageCropped(imageBase64) {
    const image: ImageBox = this.getSelectedImage()
    image.setZoomScale(1.0) //TODO
    image.loadImage(imageBase64)
  }

  onDragStart(url) {
    this.dropImageUrl = url
  }

  async onHandleDrop(offsetX, offsetY) {
    if (this.dropImageUrl) {
      const box: ImageBox = this.getImage(offsetX, offsetY)
      if (box) {
        this.setLoadingState(true)
        const imageUrl = await toDataURL("GET", this.dropImageUrl)
        box.onImageLoadCompleted = () => this.setLoadingState(false)
        box.removeImage()
        box.setImageUrl(imageUrl).loadImage(imageUrl)
        this.dropImageUrl = null
      }
    }
  }

  async setBackgroundImage(url) {
    const imageUrl = await toDataURL("GET", url)
    fabric.Image.fromURL(imageUrl, (img) => {
      const scale = Math.max(this.canvas.width / img.width, this.canvas.height / img.height)
      img.set({
        scaleX: scale,
        scaleY: scale,
      })
      this.canvas.backgroundImage = img
      this.canvas.renderAll()
    }, {crossOrigin: 'anonymous'})
  }

  //////////////////////////////////////////////////////
  //Create Collage by Template ID
  //////////////////////////////////////////////////////
  async createCollageByTemplateId(templateId) {
    try {
      this.setLoadingState(true);

      const template = await this.api.getTemplateById(templateId)
      console.log('template', template)
      if (!template) {
        return
      }

      const setting = template.setting
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.savedCollage = null
      this.removeCanvasElement()

      const canvasWidth = this.layout.calculateWidth()
      const canvasHeight = setting.canvasHeight * canvasWidth / setting.canvasWidth
      const scale = canvasWidth / setting.canvasWidth
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)

      // Add images to canvas.
      this.images = []
      template.images.forEach(it => {
        const tag = `img_${it.index}`
        this.images[tag] = new ImageBox(this.canvas)
          .setScale(1.0)
          .setTag(tag)
          .setBorder(setting.borderWidth, setting.borderColor)
          .addLockedBoard(it.left * scale, it.top * scale, it.width * scale, it.height * scale)
      })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      this.setLoadingState(false);
    }
  }

  removeVirtualCanvas(virtualCanvas) {
    virtualCanvas.dispose()
    const container = document.getElementById("virtual-canvas-container");
    if (container.childNodes.length > 0) {
      container.removeChild(container.childNodes[0]);
    }
  }

  createVirtualCanvas(width, height) {
    const container = document.getElementById("virtual-canvas-container");
    var element = document.createElement("canvas");
    element.id = "virtual-canvas";
    element.width = width;
    element.height = height;
    element.style.position = "absolute";
    element.style.border = "0px";
    container.appendChild(element);

    const scale = width / this.canvas.width
    const virtualCanvas = new fabric.Canvas("virtual-canvas", {
      fireRightClick: true,
      stopContextMenu: true,
      selection: false,
      width: width,
      height: height,
      backgroundColor: '#ddd',
    })

    return new Promise<fabric.Canvas>(resolve => {
      const objects = this.canvas.getObjects()
      const promises = objects.map(obj => {
        return new Promise(_resolve => {
          obj.clone(cloned => {
            cloned.left *= scale
            cloned.top *= scale
            cloned.scaleX *= scale
            cloned.scaleY *= scale

            if (cloned.type == 'image') {
              const image: fabric.Image = cloned
              image.clipPath.set({
                left: image.clipPath.left * scale,
                top: image.clipPath.top * scale,
                width: image.clipPath.width * scale,
                height: image.clipPath.height * scale
              })
            }
            
            virtualCanvas.add(cloned)
            _resolve(true)
          })
        })
      })

      Promise.all(promises).then(_ => {
        virtualCanvas.renderAll()
        resolve(virtualCanvas)
      })
    })
  }

  checkCanvas() {
    return this.canvas != null;
  }

  async saveImage(userId) {
    if (!this.canvas) {
      return
    }

    this.setLoadingState(true)

    const setting = this.layout.getSetting()
    const dpi = document.getElementById("dpi").clientWidth
    const width = dpi * setting.widthInch
    const height = width * (this.canvas.height / this.canvas.width)

    const virtualCanvas = await this.createVirtualCanvas(width, height)
    const dataUrl = virtualCanvas.toDataURL({
      format: 'jpeg',
      quality: 1.0
    });

    let response = null
    if (this.savedCollage) {
      const collageId = this.savedCollage._id
      response = await this.api.updateCollageImage(collageId, userId, dataUrl, width, height)
    }
    else {
      response = await this.api.saveCollageImage(userId, dataUrl, width, height)
    }
    this.removeVirtualCanvas(virtualCanvas)
    this.setLoadingState(false)

    if (!response || !response['success']) {
      return null
    }

    const data = response['data']
    this.savedCollage = data
    return data['slug']
  }

  private getTemplateInfo() {
    let index = 1
    const collages = []
    for (const tag in this.images) {
      const box: ImageBox = this.images[tag]
      const info = Object.assign({ index: index++ }, box.getBoard())
      collages.push(info);
    }
    return collages
  }

  async saveTemplate(id) {
    this.setLoadingState(true)

    const twidth = 320
    const theight = twidth * (this.canvas.height / this.canvas.width)

    const virtualCanvas = await this.createVirtualCanvas(twidth, theight)
    const dataUrl = virtualCanvas.toDataURL({
      format: 'jpeg',
      quality: 1.0
    });

    const setting = Object.assign({
      canvasWidth: this.canvas.width,
      canvasHeight: this.canvas.height
    }, this.layout.getSetting())

    const data = {setting: setting, images: this.getTemplateInfo(), image: dataUrl};
    if (id) {
      data['id'] = id
    }
    console.log("Save Template:", data);

    const template = await this.api.saveTemplate(data)
    console.log('template', template)
    
    this.removeVirtualCanvas(virtualCanvas)
    this.setLoadingState(false)
    return template
  }

  async printCollageImage(userId, way) {
    const slug = await this.saveImage(userId);
    if (slug) {
      let url = environment.apiUrl
      if (way == 0) {
        url += '/canvas-prints/order/gallary/'
      }
      else if (way == 1) {
        url += '/poster-prints/order/gallary/'
      }
      else {
        url += '/photo-prints/order/gallary/'
      }
      url += slug
      console.log(url)
      return url
    }
    else {
      console.log('failed to save image')
      return null
    }
  }

  private resizeCanvas() {
    console.log("resizeCanvas")
  }

  async onImageSelected(url) {
    const box: ImageBox = this.getSelectedImage()
    if (box) {
      this.setLoadingState(true)
      const imageUrl = await toDataURL("GET", url)
      box.onImageLoadCompleted = () => this.setLoadingState(false)
      box.removeImage()
      box.setImageUrl(imageUrl).loadImage(imageUrl)
    }
  }

  private onCellScaling(cell: ImageBox) {
    const col = cell.cellColIndex
    const row = cell.cellRowIndex
    const margin = cell.cellMargin
    
    const rect = cell.boardRect
    const rw = rect.width * rect.scaleX
    const rh = rect.height * rect.scaleY
    const p0 = new fabric.Point(rect.left, rect.top)
    const p1 = new fabric.Point(rect.left + rw, rect.top)
    const p2 = new fabric.Point(rect.left + rw, rect.top + rh)
    const p3 = new fabric.Point(rect.left, rect.top + rh)
    
    const m0 = new fabric.Point(rect.left, rect.top + rh / 2)
    const m3 = new fabric.Point(rect.left + rw / 2, rect.top)
    const m1 = new fabric.Point(rect.left + rw, rect.top + rh / 2)
    const m2 = new fabric.Point(rect.left + rw / 2, rect.top + rh)
    
    for (let tag in this.images) {
      const neigh: ImageBox = this.images[tag]
      if (neigh == cell) {
        continue
      }

      if (neigh.containsPoint(m0.x, m0.y)) {
        const br = neigh.boardRect
        const width = p0.x - br.left - margin
        if (width > 20) {
          br.set({ width: p0.x - br.left - margin, scaleX: 1.0 })
        }
        else {
          cell.boardRect.set({ left : br.left + br.width * br.scaleX + margin})
        }
      }
    }
  }
}
