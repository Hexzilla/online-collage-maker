import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle, toDataURL } from "./util";
import { environment } from '../../environments/environment';
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
  private setting: Setting
  private imageBoxes: any = {}
  private selectedTag: any
  private savedCollage: any
  private menuPoint: any
  private dropImageUrl: string
  private uniqueId: number = 0
  
  onLoadingStateChanged: Function;
  onMenuItemClicked: Function;

  constructor(private api: ApiService) {
    this.contextMenu = new CanvasContextMenu()
    this.contextMenu.onMenuItemClicked = (e) => this.onMenuItemClicked(e)
    window.addEventListener('resize', () => this.resizeCanvas(), false);
  }

  getApiSvc() {
    return this.api
  }

  setSetting(setting: Setting) {
    this.setting = setting
  }

  getSetting() {
    return this.setting
  }

  getCanvasWidth() {
    return this.canvas.width
  }

  getCanvasHeight() {
    return this.canvas.height
  }

  setLoadingState(state) {
    this.loading = state;
    this.onLoadingStateChanged && this.onLoadingStateChanged(state);
  }

  createCanvasElement(width, height) {
    const container = document.getElementById("canvas-container");
    var element = document.createElement("canvas");
    element.id = "main-canvas";
    element.width = width;
    element.height = height;
    element.style.position = "absolute";
    element.style.border = "0px";
    container.appendChild(element);
  }

  removeCanvasElement() {
    const container = document.getElementById("canvas-container");
    if (container.childNodes.length > 0) {
      container.removeChild(container.childNodes[0]);
    }
  }

  getUniqueId() {
    this.uniqueId++;
    return this.uniqueId
  }

  addImageBox(tag: string, box: ImageBox) {
    this.imageBoxes[tag] = box
  }

  removeImageBoxs() {
    this.imageBoxes = []
  }

  createSimpleImageBox() {
    return new ImageBox(this.canvas)
  }

  resetSavedCollage() {
    this.savedCollage = null
  }

  createFabricCanvas(width, height) {
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

  drawGridLines() {
    const grid = this.setting.grid
    const canvasWidth = this.canvas.getWidth()
    const canvasHeight = this.canvas.getHeight()
    for (var i = 0; i < (canvasWidth / grid); i++) {
      this.canvas.add(new fabric.Line([ i * grid, 0, i * grid, canvasHeight], { type:'line', stroke: '#ccc', selectable: false }));
      this.canvas.add(new fabric.Line([ 0, i * grid, canvasWidth, i * grid], { type: 'line', stroke: '#ccc', selectable: false }))
    }
  }

  drawCanvasSizeText() {
    const label = this.setting.getCanvasSizeText()
    const text = new fabric.Text(label, { 
      left: 5,
      top: 5,
      fontSize: 15,
      fill: 'rgb(10,10,10)',
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
      selectable: false,
    })
    this.canvas.add(text)
  }

  getSelectedImage() {
    return this.imageBoxes[this.selectedTag]
  }

  private getImage(offsetX, offsetY) {
    for (var tag in this.imageBoxes) {
      const it: ImageBox = this.imageBoxes[tag]
      if (it.containsPoint(offsetX, offsetY)) {
        return it
      }
    }
    return null
  }

  deleteSelectedImage(mode: string) {
    const box: ImageBox = this.getSelectedImage()
    box.removeImage()
    
    if (mode != 'wall') {
      if (!box.lockBoardRect) {
        box.removeBoard()
        delete this.imageBoxes[box.tag]
      }
    }
  }

  addCell() {
    this.addCellWithPos(this.menuPoint.x, this.menuPoint.y, 320, 320)
  }

  addWallFrame() {
    const cellWidth = 120
    const cellHeight = 120
    const widthInch = parseFloat((this.setting.getWidth() * cellWidth / this.canvas.width).toFixed(1))
    const heighInch = parseFloat((this.setting.getHeight() * cellHeight / this.canvas.height).toFixed(1))
    this.addCellWithPos(this.menuPoint.x, this.menuPoint.y, cellWidth, cellHeight, widthInch, heighInch)
  }

  addCellWithPos(left, top, widthPixel, heightPixel, widthInch = 0, heighInch = 0) {
    const tag = "cell_" + this.getUniqueId()
    const cell = new ImageBox(this.canvas)
      .setTag(tag)
      .setGrid(this.setting.grid)
      .setBorder(this.setting.borderWidth, this.setting.borderColor)
      .setSizeInch(widthInch, heighInch)
      .addCellBoard(left, top, widthPixel, heightPixel)
    this.imageBoxes[tag] = cell
    return cell
  }

  deleteCell() {
    const cell: ImageBox = this.getSelectedImage()
    cell.removeBoard()
    delete this.imageBoxes[cell.tag]
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
    this.setLoadingState(true)
    const imageUrl = await toDataURL("GET", url)
    fabric.Image.fromURL(imageUrl, (img) => {
      img.set({
        scaleX: this.canvas.width / img.width,
        scaleY: this.canvas.height / img.height,
      })
      this.canvas.backgroundImage = img
      this.canvas.renderAll()
    }, {crossOrigin: 'anonymous'})
    this.setLoadingState(false)
  }

  getSelectedImageBoxSize() {
    const box: ImageBox = this.getSelectedImage()
    if (box) {
      return box.getBoardSizeInInch()
    }
    return null
  }

  changeCellSize(data) {
    const box: ImageBox = this.getSelectedImage()
    if (box) {
      const w = parseFloat((this.canvas.width * data.width / this.setting.getWidth()).toFixed(1))
      const h = parseFloat((this.canvas.height * data.height / this.setting.getHeight()).toFixed(1))
      box.setSizeInch(data.width, data.height)
      box.setCellSize(w, h)
    }
  }

  setFramePrice(price) {
    const box: ImageBox = this.getSelectedImage()
    if (box) {
      box.price = price
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
      const objects = this.canvas.getObjects().filter(it => it.type !='line')
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

    const setting = this.getSetting()
    const dpi = document.getElementById("dpi").clientWidth
    const width = dpi * setting.getWidth()
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

  getTemplateInfo() {
    let index = 1
    const collages = []
    for (const tag in this.imageBoxes) {
      const box: ImageBox = this.imageBoxes[tag]
      const info = Object.assign({ index: index++ }, box.getBoard())
      collages.push(info);
    }
    return collages
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

  setObjectMoveEvent(box: ImageBox) {
    box.onObjectMove = (sender: ImageBox, dx: number, dy: number) => this.onImageBoxMove(sender, dx, dy)
  }

  onImageBoxMove(sender: ImageBox, dx: number, dy: number) {
    for (var tag in this.imageBoxes) {
      const it: ImageBox = this.imageBoxes[tag]
      if (it != sender) {
        it.objectMove(dx, dy)
      }
    }
  }
}
