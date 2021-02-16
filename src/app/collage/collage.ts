import { Injectable } from "@angular/core";
import { fabric } from 'fabric'
import { ApiService } from "../api/api";
import { CanvasLayout } from "./cavas-layout";
import { Setting } from "./setting";
import { loadImage, shuffle } from "./util";
import ImageBox from "./image-box"
import CanvasContextMenu from "./contextmenu"

@Injectable({
  providedIn: "root",
})
export class Collage {
  private canvas: any;
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

  async ngOnInit() {
    // Remove mouse click on page
    document.addEventListener("contextmenu", (event) => event.preventDefault());
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
    element.style.border = "1px solid";
    container.appendChild(element);
  }

  removeCanvasElement() {
    const container = document.getElementById("canvas-container");
    if (container.childNodes.length > 0) {
      container.removeChild(container.childNodes[0]);
    }
  }

  async createCollage(setting: Setting) {
    if (this.loading) {
      return
    }

    const containerWidth = document.getElementById("canvas-container").offsetWidth;
    this.layout = new CanvasLayout(setting, containerWidth)

    try {
      this.removeCanvasElement()
      this.setLoadingState(true);

      let res = await this.api.getImageList();
      if (res && res.images && res.images.length) {
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
        this.createCanvas(images);
      } 
    }
    catch (err) {
      console.log(err)
    }
    finally {
      this.setLoadingState(false);
    }
  }

  createCanvas(images) {
    const setting = this.layout.getSetting()

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
      const imagebox = this.createImageBox(data, tag, setting.borderWidth, setting.borderColor)
      this.images[tag] = imagebox
    })
  }

  createFabricCanvas(width, height) {
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

  createImageBox(data, tag, borderWidth, borderColor) {
    return new ImageBox({
      canvas: this.canvas,
      url: data.src,
      offsetX: data.left,
      offsetY: data.top,
      scale: data.scale,
      tag: tag,
      borderWidth: borderWidth,
      borderColor: borderColor
    })
  }

  getSelectedImage() {
    return this.images[this.selectedTag]
  }

  getCollageInfo() {
    const collages = []
    for (const tag in this.images) {
      const img: ImageBox = this.images[tag]
      collages.push(img.getImageInfo());
    }
    return collages
  }

  setTemplate(template) {
    
  }

  onMenuItemClicked(e) {
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

  onEditImage(url) {
    this.openDialog && this.openDialog(url)
  }

  async saveTemplate() {
    const setting = this.layout.getSetting()
    const data = {...setting, images: this.getCollageInfo()};
    console.log("Save Template:", data);
    await this.api.saveTemplate(data)
  }

  async selectTemplate() {
    await this.saveTemplate()
  }

  async createBoardByTemplateId(templateId) {
    //this.resetCanvas()
    //this.setLoadingState(true);
  }
}
