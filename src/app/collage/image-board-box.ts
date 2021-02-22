import { fabric } from 'fabric'

class Rect {
  left: number
  top: number
  width: number
  height: number

  constructor(left, top, width, height) {
    this.left = left
    this.top = top
    this.width = width
    this.height = height
  }
}

class ImageBoardBox {
  name: string = 'ImageBoardBox'
  url: string
  canvas: fabric.Canvas
  image: fabric.Image
  initialScale: number = 1.0
  scale: number = 1.0
  zoom: number = 1.0
  brightness: number = 0.01
  maskRect: fabric.Rect
  boardRect: fabric.Rect
  tag: string
  strokeColor: string = 'rgb(136, 0, 26)'
  strokeWidth: number = 0
  onImageLoadCompleted: Function

  constructor(canvas) {
    this.canvas = canvas
  }

  setTag(tag) {
    this.tag = tag
    return this
  }

  setScale(scale) {
    this.initialScale = this.scale = scale
    return this
  }

  setBoard(left, top, width, height) {
    this.boardRect = new fabric.Rect({
      type: this.tag,
      originX: 'left',
      originY: 'top',
      left: left,
      top: top,
      width: width,
      height: height,
      fill: 'rgba(215,215,215,1)',
      absolutePositioned: true,
      selectable: false,
      stroke: this.strokeColor,
      strokeWidth: 1,
      padding: 0,
    })
    this.canvas.add(this.boardRect)
    return this
  }

  getBoard(): Rect {
    const bw = this.boardRect.width * this.boardRect.scaleX
    const bh = this.boardRect.height * this.boardRect.scaleY
    return new Rect(this.boardRect.left, this.boardRect.top, bw, bh)
  }

  setBorder(borderWidth, borderColor) {
    this.strokeWidth = borderWidth
    this.strokeColor = borderColor
    return this
  }

  reset() {
    this.initialScale = this.scale = 1.0
    this.zoom = 1.0
    this.brightness = 0.01
    this.image && this.canvas.remove(this.image)
  }

  getImageUrl() {
    return this.url
  }

  setImageUrl(url) {
    this.url = url
    return this
  }

  loadImage(url) {
    if (url) {
      fabric.Image.fromURL(url, (img) => this.onImageLoaded(img), {crossOrigin: 'anonymous'})
    }
  }

  private onImageLoaded(img) {
    if (this.image) {
      this.deleteImage()
    }
    this.image = img
    this.updateImage()
    this.canvas.add(this.image)

    this.updateClipPath()
    this.onImageLoadCompleted && this.onImageLoadCompleted()
  }

  setBrightness(value) {
    this.brightness = value
    var filter = new fabric.Image.filters.Brightness({
      brightness: value
    });
    this.image.filters = [filter];
    this.image.applyFilters();
    this.canvas.renderAll()
  }

  setZoomScale(zoom) {
    this.zoom = zoom
    this.update()
  }

  containsPoint(px, py) {
    console.log(this.boardRect.width, this.boardRect.height)
    return this.boardRect.containsPoint(new fabric.Point(px, py))
  }

  deleteImage() {
    this.canvas.remove(this.image)
  }

  restoreImage() {
    this.initialScale = this.scale = 1.0
    this.zoom = 1.0
    this.brightness = 0.01
    this.loadImage(this.url)
  }

  update() {
    this.updateImage()
    this.updateClipPath()
    this.setBrightness(this.brightness)
    this.canvas.renderAll()
  }

  private updateImage() {
    if (!this.image) {
      return
    }

    const scaleX = this.boardRect.width / this.image.width
    const scaleY = this.boardRect.height / this.image.height
    const scale = Math.max(scaleX, scaleY)
    const offsetX = (this.image.width * scale - this.boardRect.width) / 2
    const offsetY = (this.image.height * scale - this.boardRect.height) / 2

    this.image.set({
      left: this.boardRect.left - offsetX,
      top:  this.boardRect.top - offsetY,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false
    })

    this.image.setControlsVisibility({
      mtr: false,
    })
  }

  private updateClipPath() {
    this.image.clipPath = new fabric.Rect({
      originX: 'left',
      originY: 'top',
      left: this.boardRect.left,
      top: this.boardRect.top,
      width: this.boardRect.width,
      height: this.boardRect.height,
      scaleX: 1.0,
      scaleY: 1.0,
      absolutePositioned: true,
    })
  }
}

export default ImageBoardBox
