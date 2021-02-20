import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle } from "./util";
import { environment } from './../../environments/environment';
import ImageBox from "./image-box"
import ImageCell from "./image-cell"
import ImageBoardBox from "./image-board-box"
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
  
  onLoadingStateChanged: Function;
  openDialog: Function;

  constructor(private api: ApiService) {
    this.contextMenu = new CanvasContextMenu()
    this.contextMenu.onMenuItemClicked = (e) => this.onMenuItemClicked(e)
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
  //Smart Collage
  //////////////////////////////////////////////////////
  async createSmartCollage(setting: Setting) {
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

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
          console.log("LoadImage", image['width'], image['height'])
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
      const layoutItems = this.layout.getLayoutItems(images, perfectRows, canvasWidth, setting.borderWidth);
      const sumOfHeight = layoutItems.reduce((accumulator, item) => {
        return Math.max(accumulator, item.top + item.height);
      }, 0);

      // Create canvas and fabric
      const canvasHeight = setting.borderWidth + sumOfHeight
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)

      // Add images to canvas.
      this.images = []
      layoutItems.forEach(data => {
        const tag = `img_${data.col}_${data.row}`
        this.images[tag] = new ImageBox(this.canvas)
          .setImageOffset(data.left, data.top)
          .setScale(data.scale)
          .setTag(tag)
          .setBorder(setting.borderWidth, setting.borderColor)
          .setImageUrl(data.src)
      })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      this.setLoadingState(false);
    }
  }

  createTemplate(setting: Setting) {
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.savedCollage = null
      this.removeCanvasElement()

      const canvasWidth = this.layout.calculateWidth();
      const canvasHeight = this.layout.calculateHeight();
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)
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
      backgroundColor: '#444',
    })

    this.canvas.on('mouse:down', (event) => {
      if (event.button === 1) {
        this.contextMenu.hideMenu()
      }
    })

    this.canvas.on('mouse:up', (event) => {
      if (event.button === 3) {
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
    })
  }

  private getSelectedImage() {
    return this.images[this.selectedTag]
  }

  private getImage(offsetX, offsetY) {
    for (var tag in this.images) {
      const it = this.images[tag]
      if (it.containsPoint(offsetX, offsetY)) {
        return it
      }
    }
    return null
  }

  private cellIndex: number = 0
  private onMenuItemClicked(e) {
    const elementId = e.target['id'];
    if (elementId == 'edit') {
      const image: ImageBox = this.getSelectedImage()
      this.onEditImage(image.getImageUrl())
    }
    else if (elementId == 'delete') {
      const image: ImageBox = this.getSelectedImage()
      image.deleteImage()
      delete this.images[image.tag]
    }
    else if (elementId == 'restore') {
      const image: ImageBox = this.getSelectedImage()
      image.restoreImage()
    }
    else if (elementId == 'addCell') {
      this.addCell()
    }
    else if (elementId == 'deleteCell') {
      this.deleteCell()
    }
  }

  addCell() {
    console.log(this.menuPoint)
    this.cellIndex++
    const tag = "cell_" + this.cellIndex
    const cell = new ImageCell(this.canvas, this.menuPoint, tag)
    this.images[tag] = cell
  }

  deleteCell() {
    const cell: ImageCell = this.getSelectedImage()
    cell.delete()
    delete this.images[cell.tag]
  }

  onImageChanged(scale, brightness) {
    const image: ImageBox = this.getSelectedImage()
    image.onImageChanged(scale, brightness)
  }

  onImageCropped(left, top, width, height) {
    const image: ImageBox = this.getSelectedImage()
    image.onImageCropped(left, top, width, height)
  }

  private onEditImage(url) {
    this.openDialog && this.openDialog(url)
  }

  dragImageUrl: string
  onDragStart(url) {
    this.dragImageUrl = url
  }

  onHandleDrop(offsetX, offsetY) {
    if (this.dragImageUrl) {
      const image: ImageBoardBox = this.getImage(offsetX, offsetY)
      if (!image) {
        return
      }

      this.setLoadingState(true)
      image.onImageLoadCompleted = () => this.setLoadingState(false)
      image.setImageUrl(this.dragImageUrl)
      this.dragImageUrl = null
    }
  }

  //////////////////////////////////////////////////////
  //Create Collage by Template ID
  //////////////////////////////////////////////////////
  async createCollageByTemplateId(templateId) {
    console.log('createCollageByTemplateId', templateId)
    
    try {
      this.setLoadingState(true);

      const template = await this.api.getTemplateById(templateId)
      console.log(template)
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
        this.images[tag] = new ImageBoardBox(this.canvas)
          .setImageOffset(it.left * scale, it.top * scale)
          .setScale(1.0)
          .setTag(tag)
          .setBorder(setting.borderWidth, setting.borderColor)
          .setBoard(it.width * scale, it.height * scale)
      })
      console.log(this.images)
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
      backgroundColor: '#444',
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
            _resolve()
          })
        })
      })

      Promise.all(promises).then(_ => {
        virtualCanvas.renderAll()
        resolve(virtualCanvas)
      })
    })
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

    console.log('response', response)
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
      const img: ImageCell = this.images[tag]
      const info = Object.assign({ index: index++ }, img.getCellInfo())
      collages.push(info);
    }
    return collages
  }

  async saveTemplate(id) {
    this.setLoadingState(true)

    const twidth = 200
    const theight = twidth * (this.canvas.height / this.canvas.width)

    const virtualCanvas = await this.createVirtualCanvas(twidth, theight)
    const dataUrl = virtualCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.8
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
}
