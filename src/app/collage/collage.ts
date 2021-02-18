import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle } from "./util";
import ImageBox from "./image-box"
import ImageBoardBox from "./image-board-box"
import CanvasContextMenu from "./contextmenu"


const admin_templates = [
  {
    id: 1,
    setting: {
      widthInch: 16,
      heightInch: 12,
      landscape: false,
      borderWidth: 10,
      borderColor: "rgb(0, 0, 255)"
    },
    images: [
      {
        index: 1,
        left: 0,
        top: 0,
        width: 300,
        height: 400,
      },
      {
        index: 2,
        left: 400,
        top: 0,
        width: 300,
        height: 400,
      },
      {
        index: 3,
        left: 800,
        top: 0,
        width: 300,
        height: 400,
      },
      {
        index: 4,
        left: 0,
        top: 450,
        width: 600,
        height: 400,
      },
      {
        index: 5,
        left: 650,
        top: 450,
        width: 400,
        height: 400,
      }
    ]
  }
]


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
    element.style.border = "1px solid";
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
      const perfectRows = this.layout.getCanvasLayout(images);
      const layoutItems = this.layout.getLayoutItems(images, perfectRows);
      const sumOfHeight = layoutItems.reduce((accumulator, item) => {
        return Math.max(accumulator, item.top + item.height);
      }, 0);

      // Create canvas and fabric
      const canvasHeight = setting.borderWidth + sumOfHeight
      const canvasWidth = this.layout.calculateWidth();
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

    this.canvas.on('mouse:up', (event) => {
      if (event.button === 1) {
        this.contextMenu.hideMenu()
      }
      else if (event.button === 3) {
        this.selectedTag = event.target.type

        var pointer = this.canvas.getPointer(event.e);
        const el = document.getElementById('main-canvas')
        var viewportOffset = el.getBoundingClientRect();

        var px = viewportOffset.x + pointer.x;
        var py = viewportOffset.y + pointer.y;
        this.contextMenu.createMenu(px, py)
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

  private onMenuItemClicked(e) {
    const elementId = e.target['id'];
    if (elementId == 'edit') {
      const image: ImageBox = this.getSelectedImage()
      this.onEditImage(image.getImageUrl())
    }
    else if (elementId == 'delete') {
      const image: ImageBox = this.getSelectedImage()
      image.deleteImage()
      const index = this.images.indexOf(image)
      this.images.splice(index, 1)
    }
    else if (elementId == 'restore') {
      const image: ImageBox = this.getSelectedImage()
      image.restoreImage()
    }
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
      const image = this.getImage(offsetX, offsetY)
      if (!image) {
        return
      }

      console.log(image)
      image.setImageUrl(this.dragImageUrl)
      this.dragImageUrl = null
    }
  }

  //////////////////////////////////////////////////////
  //Create Collage by Template ID
  //////////////////////////////////////////////////////
  async createCollageByTemplateId(templateId) {
    const template = admin_templates.find(it => it.id == templateId)
    if (!template) {
      return
    }

    if (this.loading) {
      return
    }

    try {
      const setting = template.setting
      const ccw = this.getCanvasContainerWidth()
      this.layout = new CanvasLayout(setting, ccw)

      this.removeCanvasElement()
      this.setLoadingState(true);

      const canvasWidth = this.layout.calculateWidth()
      const canvasHeight = this.layout.calculateHeight()
      this.createCanvasElement(canvasWidth, canvasHeight)
      this.createFabricCanvas(canvasWidth, canvasHeight)

      // Add images to canvas.
      this.images = []
      template.images.forEach(it => {
        const tag = `img_${it.index}`
        this.images[tag] = new ImageBoardBox(this.canvas)
          .setImageOffset(it.left, it.top)
          .setScale(1.0)
          .setTag(tag)
          .setBorder(setting.borderWidth, setting.borderColor)
          .setBoard(it.width, it.height)
      })
    }
    catch (err) {
      console.log(err)
    }
    finally {
      this.setLoadingState(false);
    }
  }

  getCollageInfo() {
    const collages = []
    for (const tag in this.images) {
      const img: ImageBox = this.images[tag]
      collages.push(img.getImageInfo());
    }
    return collages
  }

  async saveTemplate() {
    const setting = this.layout.getSetting()
    const data = {setting: setting, images: this.getCollageInfo()};
    console.log("Save Template:", data);
    await this.api.saveTemplate(data)
  }
}
