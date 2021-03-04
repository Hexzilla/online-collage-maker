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

class ImageBox {
  name: string = 'ImageBox'
  url: string
  canvas: fabric.Canvas
  image: fabric.Image
  zoom: number = 1.0
  brightness: number = 0.01
  cellSizeText: fabric.Text
  boardRect: fabric.Rect
  backBoard: fabric.Rect
  boardRectPos: fabric.Point
  lockBoardRect: Boolean
  tag: string
  grid: number = 0
  strokeColor: string = 'rgb(136, 0, 26)'
  strokeWidth: number = 0
  onImageLoadCompleted: Function

  showWidth: number = 0
  showHeight: number = 0

  constructor(canvas) {
    this.canvas = canvas
    this.canvas.on('mouse:down', (e) => this.onMouseDown(e))
    //this.canvas.on('mouse:up', (e) => this.onMouseUp(e))
    this.canvas.on('object:moving', (e) => this.onObjectMoving(e))
    this.canvas.on('object:moved', (e) => this.onObjectMoved(e))
    this.canvas.on('object:scaling', (e) => this.onObjectScaling(e))
    this.canvas.on('object:scaled', (e) => this.onObjectScaled(e))
  }

  setTag(tag) {
    this.tag = tag
    return this
  }

  setScale(scale) {
    return this
  }

  addLockedBoard(left, top, width, height) {
    this.lockBoardRect = true

    this.backBoard = new fabric.Rect({
      type: this.tag,
      originX: 'left',
      originY: 'top',
      left: left,
      top: top,
      width: width,
      height: height,
      fill: 'rgba(160,160,160,1)',
      absolutePositioned: true,
      selectable: false,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      padding: 0,
    })
    this.canvas.add(this.backBoard)

    this.boardRect = new fabric.Rect({
      type: this.tag,
      originX: 'left',
      originY: 'top',
      left: left,
      top: top,
      width: width,
      height: height,
      fill: 'rgba(0,0,0,0)',
      absolutePositioned: true,
      selectable: false,
      strokeWidth: 0,
      padding: 0,
    })
    this.canvas.add(this.boardRect)
    return this
  }

  addMovableBoard(left, top, width, height) {
    this.lockBoardRect = false
    this.boardRect = new fabric.Rect({
      type: this.tag,
      originX: 'left',
      originY: 'top',
      left: left,
      top: top,
      width: width,
      height: height,
      opacity: 1.0,
      fill: 'rgba(255,255,255, 0)',
      absolutePositioned: true,
      lockScalingFlip: true,
      selectable: true,
      transparentCorners: false,
      cornerColor: 'white',
      cornerStrokeColor: 'black',
      borderColor: 'black',
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      cornerSize: 8,
      padding: 0,
      cornerStyle: 'circle',
      borderDashArray: [5, 5],
      borderScaleFactor: 1.0
    })
    this.boardRect.setControlsVisibility({mb: false, ml: false, mr: false, mt: false, mtr: false})
    this.canvas.add(this.boardRect)
    this.boardRectPos = new fabric.Point(this.boardRect.left, this.boardRect.top)
    return this
  }

  addCellBoard(left, top, width, height) {
    this.lockBoardRect = false
    this.boardRect = new fabric.Rect({
      type: this.tag,
      originX: 'left',
      originY: 'top',
      left: left,
      top: top,
      width: width,
      height: height,
      opacity: 1.0,
      fill: 'rgba(100,100,100, 0.0)',
      absolutePositioned: true,
      lockScalingFlip: true,
      selectable: true,
      transparentCorners: false,
      cornerColor: 'white',
      cornerStrokeColor: 'black',
      borderColor: 'black',
      cornerSize: 8,
      stroke: this.strokeColor,
      strokeWidth: Math.max(1, this.strokeWidth),
      padding: 0,
      cornerStyle: 'circle',
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3
    })

    this.boardRect.setControlsVisibility({mtr: false})
    this.boardRectPos = new fabric.Point(this.boardRect.left, this.boardRect.top)
    this.canvas.add(this.boardRect)

    if (this.showWidth && this.showHeight) {
      this.cellSizeText = new fabric.Text(`${this.showWidth}" x ${this.showHeight}"`, { 
        left: this.boardRect.left + this.strokeWidth + 3, //Take the block's position
        top: this.boardRect.top + this.strokeWidth + 3, 
        fontSize: 15,
        fill: 'rgb(20,20,20)',
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
      })
      this.canvas.add(this.cellSizeText)
    }

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

  setShowSize(showWidth, showHeight) {
    this.showWidth = showWidth
    this.showHeight = showHeight
    return this
  }

  reset() {
    this.zoom = 1.0
    this.brightness = 0.01
    this.loadImage(this.url)
  }

  setGrid(grid) {
    this.grid = grid
    return this;
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
    return this
  }

  private onImageLoaded(img) {
    if (this.image) {
      this.removeImage()
    }
    this.image = img
    this.updateImage()
    this.canvas.add(this.image)

    this.update()
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
    return this.boardRect.containsPoint(new fabric.Point(px, py))
  }

  removeImage() {
    this.image && this.canvas.remove(this.image)
    this.image = null
  }

  removeBoard() {
    this.boardRect && this.canvas.remove(this.boardRect)
    this.cellSizeText && this.canvas.remove(this.cellSizeText)
    this.boardRect = this.cellSizeText = null
  }

  restoreImage() {
    this.zoom = 1.0
    this.brightness = 0.01
    this.loadImage(this.url)
  }

  update() {
    this.updateImage()
    this.addImageClipPath()
    this.canvas.bringToFront(this.boardRect)
    this.canvas.renderAll()
  }

  private updateImage() {
    if (!this.image) {
      return
    }

    const bw = this.boardRect.width * this.boardRect.scaleX
    const bh = this.boardRect.height * this.boardRect.scaleY
    const scaleX = bw / this.image.width
    const scaleY = bh / this.image.height
    const scale = this.zoom * Math.max(scaleX, scaleY)
    const offsetX = (this.image.width * scale - bw) / 2
    const offsetY = (this.image.height * scale - bh) / 2

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

  private updateSizeText() {
    if (this.cellSizeText) {
      const board = this.boardRect
      const width = (board.scaleX * this.showWidth).toFixed(2)
      const height = (board.scaleY * this.showHeight).toFixed(2)
      this.cellSizeText.set({
        left: this.boardRect.left,
        top: this.boardRect.top,
        text: `${width}" x ${height}"`,
      })
    }
  }

  private addImageClipPath() {
    if (this.image) {
      this.image.clipPath = new fabric.Rect({
        originX: 'left',
        originY: 'top',
        left: this.boardRect.left,
        top: this.boardRect.top,
        width: this.boardRect.width * this.boardRect.scaleX,
        height: this.boardRect.height * this.boardRect.scaleY,
        scaleX: 1.0,
        scaleY: 1.0,
        absolutePositioned: true,
      })
    }
  }

  onMouseDown(e) {
    if (!this.lockBoardRect) {
      if (e.target && e.target.type == this.tag) {
        this.canvas.bringToFront(this.image)
        this.canvas.bringToFront(this.boardRect)
        this.canvas.setActiveObject(this.boardRect)
      }
    }
  }

  onMouseUp(e) {
    if (this.boardRect) {
      const r = this.boardRect
      r.width = r.width * r.scaleX
      r.scaleX = 1
      r.height = r.height * r.scaleY
      r.scaleY = 1
      r.strokeWidth = this.strokeWidth
    }
  }

  onObjectMoving(e) {
    if (e.target.type == this.tag) {
      if (this.grid) {
        e.target.set({
          left: Math.round(e.target.left / this.grid) * this.grid,
          top: Math.round(e.target.top / this.grid) * this.grid
        });
      }

      const dx = e.target.left - this.boardRectPos.x
      const dy = e.target.top - this.boardRectPos.y
      if (this.image) {
        this.image.left += dx
        this.image.top  += dy
      }

      this.boardRectPos = new fabric.Point(e.target.left, e.target.top)
      this.addImageClipPath()
      this.updateSizeText()
    }
  }

  onObjectMoved(e) {
    if (e.target.type == this.tag) {
      if (e.target.left > this.canvas.width) {
        e.target.left = this.canvas.width - e.target.width
      }
      if (e.target.top > this.canvas.height) {
        e.target.top = this.canvas.height - e.target.height
      }
      if (e.target.left + e.target.width < 0) {
        e.target.left = 0
      }
      if (e.target.top + e.target.height < 0) {
        e.target.top = 0
      }
      this.onObjectMoving(e)
      this.canvas.renderAll()
    }
  }

  onObjectScaling(e) {
    if (e.target.type == this.tag) {
      this.boardRect.strokeWidth = this.strokeWidth / e.target.scaleX;
      this.boardRectPos = new fabric.Point(e.target.left, e.target.top)
      this.updateImage()
      this.updateSizeText()
      this.addImageClipPath()

      this.canvas.renderAll()
    }
  }

  onObjectScaled(e) {
    if (e.target.type == this.tag) {
      if (this.grid) {
        let width = e.target.scaleX * e.target.width
        let height = e.target.scaleY * e.target.height
        let newWidth = (Math.round(width / this.grid)) * this.grid;
        let newHeight = (Math.round(height / this.grid)) * this.grid;
        e.target.set({ 
          scaleX: e.target.scaleX * newWidth / width,
          scaleY: e.target.scaleY * newHeight / height
        });
      }
    }
  }
}

export default ImageBox
