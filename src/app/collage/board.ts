import { fabric } from 'fabric'
import ImageBox from './image-box'
import CanvasContextMenu from './contextmenu'

class Board {
  canvas: fabric.Canvas
  padding: number = 0
  selectedTag: any
  images: any = {}
  onEditImage: Function
  contextMenu: CanvasContextMenu

  constructor(element: string, width: number, height: number){
    this.contextMenu = new CanvasContextMenu()
    this.contextMenu.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    this.canvas = new fabric.Canvas(element, {
      fireRightClick: true,
      stopContextMenu: true,
      selection: false,
      width: width,
      height: height,
      backgroundColor: '#444',
    })

    /*var background = new fabric.Rect({
      left: 0,
      top: 0,
      fill: 'white', //'#888888',
      width: this.canvas.width,
      height: this.canvas.height,
      selectable: false,
    })
    this.canvas.add(background)

    let rect = new fabric.Rect({
      left: this.padding,
      top:  this.padding,
      fill: 'grey',
      width: this.canvas.width - this.padding * 2,
      height: this.canvas.height - this.padding * 2,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false,
    })
    this.canvas.add(rect)*/

    this.canvas.on('mouse:up', (event) => {
      console.log(event, event.target)
      
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

  getWidth() {
    return this.canvas.width - 2 * this.padding
  }

  getHeight() {
    return this.canvas.height - 2 * this.padding
  }

  setImages(images, borderWidth, borderColor) {
    this.images = []
    images.forEach(item => this.addImage(item, borderWidth, borderColor))
  }

  addImage(data, borderWidth, borderColor) {
    const tag = `img_${data.col}_${data.row}`

    const imagebox = new ImageBox({
      canvas: this.canvas,
      url: data.src,
      offsetX: data.left,
      offsetY: data.top,
      scale: data.scale,
      tag: tag,
      borderWidth: borderWidth,
      borderColor: borderColor
    })
    this.images[tag] = imagebox
  }

  getSelectedImage() {
    return this.images[this.selectedTag]
  }

  getCollageInfo() {
    const collages = []
    console.log(this.images);
    for (const tag in this.images) {
      const img: ImageBox = this.images[tag]
      collages.push(img.getImageInfo());
    }
    return collages
  }

  onMenuItemClicked(e) {
    const elementId = e.target['id'];
    if (elementId == 'edit') {
      const image: ImageBox = this.getSelectedImage()
      this.onEditImage && this.onEditImage(image.getImageUrl())
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
    console.log('onImageChanged', scale, brightness)
    const image: ImageBox = this.getSelectedImage()
    image.onImageChanged(scale, brightness)
  }

  onImageCropped(left, top, width, height) {
    const image: ImageBox = this.getSelectedImage()
    image.onImageCropped(left, top, width, height)
  }
}

export default Board
