import { Component, OnInit, Input } from "@angular/core";
import { fabric } from "fabric";
import { Collage } from "../collage/collage";

@Component({
  selector: "image-editor",
  templateUrl: "image-editor.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class ImageEditorComponent implements OnInit {
  canvas: fabric.Canvas;
  image: fabric.Image;
  scale: number = 1.0;
  selectionRect: fabric.Rect;
  startPoint: fabric.Point;
  brightness: number = 0.1;

  @Input("imageUrl") imageUrl: string;

  constructor(
    private collage: Collage
  ) {}


  ngOnInit() {
    
  }

  ngOnChanges() {
    this.createCanvas()
    if (this.imageUrl) {
      this.image && this.canvas.remove(this.image);
      fabric.Image.fromURL(this.imageUrl, (img) => this.onImageLoaded(img));
    }
  }

  createCanvas() {
    if (this.canvas) {
      this.canvas.dispose()
    }

    this.canvas = new fabric.Canvas("crop-canvas", {
      fireRightClick: true,
      stopContextMenu: true,
      backgroundColor: "grey",
    });

    this.canvas.on("mouse:down", (e) => this.onMouseDown(e));
    this.canvas.on("mouse:up", (e) => this.onMouseUp(e));
  }

  /*containsPoint(rect, point) {
      const sx = rect.left, sy = rect.top
      const ex = sx + rect.width, ey = sy + rect.height
      return (point.x >= sx && point.x <= ex && point.y >= sy && point.y <= ey)
    }*/

  onMouseDown(e) {
    if (e.target != this.selectionRect) {
      this.canvas.remove(this.selectionRect);
      this.selectionRect = null;
    }
    const pt = e.pointer;
    this.startPoint = new fabric.Point(pt.x, pt.y);
  }

  onMouseUp(e) {
    if (!this.selectionRect) {
      const left = Math.min(this.startPoint.x, e.pointer.x);
      const right = Math.min(this.startPoint.y, e.pointer.y);
      const width = Math.abs(this.startPoint.x - e.pointer.x);
      const height = Math.abs(this.startPoint.y - e.pointer.y);
      if (width > 0 && height > 0) {
        this.addSelectionRect(left, right, width, height);
        this.canvas.setActiveObject(this.selectionRect);
      }
    }
  }

  onImageLoaded(img) {
    this.image = img;
    this.canvas.add(img);
    this.updateImageScale();
  }

  getImageScale() {
    const iw = this.image.width;
    const ih = this.image.height;
    return (
      this.scale * Math.min(this.canvas.width / iw, this.canvas.height / ih)
    );
  }

  updateImageScale() {
    const scale = this.getImageScale();
    this.image.set({
      left: 0,
      top: 0,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
    });
    this.canvas.centerObject(this.image);
    this.canvas.renderAll();
  }

  setBrightness(value) {
    var filter = new fabric.Image.filters.Brightness({
      brightness: value,
    });
    this.image.filters = [filter];
    this.image.applyFilters();
    this.canvas.renderAll();
  }

  addSelectionRect(left, top, width, height) {
    if (this.selectionRect) {
      this.canvas.remove(this.selectionRect);
    }

    height = (this.image.height * width) / this.image.width;
    this.selectionRect = new fabric.Rect({
      fill: "rgba(0,0,0,0.3)",
      originX: "left",
      originY: "top",
      stroke: "black",
      opacity: 1,
      left: left,
      top: top,
      width: width,
      height: height,
      transparentCorners: false,
      cornerColor: "white",
      cornerStrokeColor: "black",
      borderColor: "black",
      cornerSize: 12,
      padding: 0,
      cornerStyle: "circle",
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3,
    });

    this.selectionRect.setControlsVisibility({
      ml: false,
      mr: false,
      mt: false,
      mb: false,
      mtr: false,
    });
    //this.selectionRect.scaleToWidth(300)
    //this.canvas.centerObject(this.selectionRect);
    this.canvas.add(this.selectionRect);
  }

  onImageSizeChanged(e) {
    const el = document.getElementById("image-size-value");
    el.innerHTML = e.value + "%";
    this.scale = e.value / 100;
    this.updateImageScale();
  }

  onBrightnessChanged(e) {
    const el = document.getElementById("image-brightness-value");
    el.innerHTML = e.value;
    this.brightness = e.value / 100;
    this.setBrightness(this.brightness);
  }

  onApply() {
    if (this.scale != 1.0 || this.brightness != 0.1) {
      this.collage.board.onImageChanged(this.scale, this.brightness);
    }
    if (this.selectionRect) {
      this.canvas.remove(this.selectionRect);
      this.selectionRect = null;
    }
  }

  onCropImage() {
    if (this.selectionRect) {
      const scale = this.getImageScale();
      const rect = this.selectionRect;
      const left = (rect.left - this.image.left) / scale;
      const top = (rect.top - this.image.top) / scale;
      const width = rect.width / scale;
      const height = rect.height / scale;
      console.log(left, top, width, height);
      this.collage.board.onImageCropped(left, top, width, height);

      this.canvas.remove(this.selectionRect);
      this.selectionRect = null;
    }
  }
}
