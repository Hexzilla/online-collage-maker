import { fabric } from 'fabric'

class ImageCell {
  name: string = 'ImageCell'
  tag: string = null
  canvas: fabric.Canvas = null
  cellRect: fabric.Rect = null

  constructor(canvas, pos, tag, borderSize, borderColor) {
    this.canvas = canvas
    this.tag = tag

    this.cellRect = new fabric.Rect({
      type: tag,
      originX: 'left',
      originY: 'top',
      left: pos.x,
      top: pos.y,
      width: 320,
      height: 320,
      opacity: 1.0,
      fill: 'rgba(255,255,255, 1.0)',
      absolutePositioned: true,
      lockScalingFlip: true,
      selectable: true,
      transparentCorners: false,
      cornerColor: 'white',
      cornerStrokeColor: 'black',
      borderColor: 'black',
      cornerSize: 12,
      padding: 0,
      cornerStyle: 'circle',
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3
    })

    this.cellRect.setControlsVisibility({mtr: false})
    this.canvas.add(this.cellRect)
  }

  getCellInfo() {
    const rect = this.cellRect
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width * rect.scaleX,
      height: rect.height * rect.scaleY
    }
  }

  delete() {
    this.canvas.remove(this.cellRect)
  }
}

export default ImageCell
