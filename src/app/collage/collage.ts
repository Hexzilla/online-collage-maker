import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle, toDataURL } from "./util";
import { environment } from './../../environments/environment';
import ImageCell from "./image-cell"
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
  private selectedTemplate: any
  
  onLoadingStateChanged: Function;
  openImageEditor: Function;
  openImageCropper: Function;
  onTemplateSelected: Function;
  onMenuItemClicked: Function;

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
  //Create Auto Collage
  //////////////////////////////////////////////////////
  async createAutoCollage(setting: Setting) {
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.selectedTemplate = null
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
          //.setScale(data.scale)
          .setTag(tag)
          .setBorder(setting.borderWidth, setting.borderColor)
          .addMovableBoard(data.left, data.top, data.width, data.height)
          .setImageUrl(data.img.src)
          .loadImage(data.img.src)
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
    console.log(setting)
    if (this.loading) {
      return
    }

    try {
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.savedCollage = null
      this.removeCanvasElement()

      const canvasWidth = this.layout.calculateWidth();
      const canvasHeight = canvasWidth * setting.heightInch / setting.widthInch;
      console.log(canvasWidth, canvasHeight)
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

  getSelectedImage() {
    console.log(this.images)
    console.log(this.selectedTag)
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

  /*private onMenuItemClicked(e) {
    const elementId = e.target['id'];
    if (elementId == 'edit') {
      const image: ImageBox = this.getSelectedImage()
      this.onEditImage(image)
    }
    if (elementId == 'crop') {
      const image: ImageBox = this.getSelectedImage()
      this.onEditImage(image)
    }
    else if (elementId == 'delete') {
      const image: ImageBox = this.getSelectedImage()
      image.deleteImage()
      delete this.images[image.tag]
    }
    else if (elementId == 'deleteImage') {
      const image = this.getSelectedImage()
      if (image.name == 'ImageBoardBox') {
        image.reset()
      }
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
  }*/

  private cellIndex: number = 0
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
    //image.onImageChanged(scale, brightness)
  }

  onImageCropped(left, top, width, height) {
    const image: ImageBox = this.getSelectedImage()
    //image.onImageCropped(left, top, width, height)
  }

  /*onSmartImageCropped(croppedImage) { //TODO
    const box: ImageBoardBox = this.getSelectedImage()
    box.loadImage(croppedImage)
  }*/

  /*TODO
  private onEditImage(image) {
    const url = image.getImageUrl()
    if (url) {
      if (!this.selectedTemplate) {
        this.openImageEditor && this.openImageEditor(url)
      }
      else {
        const board = image.getBoard()
        this.openImageCropper && this.openImageCropper(url, board.width, board.height)
      }
    }
  }*/

  dropImageUrl: string
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
        box.reset()
        box.setImageUrl(imageUrl).loadImage(imageUrl)
        this.dropImageUrl = null
      }
    }
  }

  //////////////////////////////////////////////////////
  //Create Collage by Template ID
  //////////////////////////////////////////////////////
  async createCollageByTemplateId(templateId) {
    try {
      this.setLoadingState(true);

      const template = await this.api.getTemplateById(templateId)
      console.log('template', template)
      this.selectedTemplate = template
      if (!template) {
        return
      }

      const setting = template.setting
      this.onTemplateSelected && this.onTemplateSelected(setting)

      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.savedCollage = null
      this.removeCanvasElement()

      const canvasWidth = this.layout.calculateWidth()
      const canvasHeight = setting.canvasHeight * canvasWidth / setting.canvasWidth
      const scale = canvasWidth / setting.canvasWidth
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)
      console.log('scale', canvasWidth, setting.canvasWidth, scale);

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

    const twidth = 160
    const theight = twidth * (this.canvas.height / this.canvas.width)

    const virtualCanvas = await this.createVirtualCanvas(twidth, theight)
    const dataUrl = virtualCanvas.toDataURL({
      format: 'jpeg',
      quality: 0.5
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
