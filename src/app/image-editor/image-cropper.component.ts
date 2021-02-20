import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { fabric } from "fabric";
import { Collage } from "../collage/collage";

export interface ImageData {
  imageUrl: string;
  ratio: number;
  width: number;
  height: number;
}

export interface ImageCrop {
  changed: Boolean;
  scale: number;
  left: number;
  top: number;
  zoom: number;
  brightness: number;
}

@Component({
  selector: "image-cropper",
  templateUrl: "image-cropper.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class ImageCropperComponent implements OnInit {
  canvas: fabric.Canvas;
  image: fabric.Image;
  crop: ImageCrop;
  selectionRect: fabric.Rect;
  startPoint: fabric.Point;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData,
    private collage: Collage
  ) { }

  ngOnInit() {
    console.log("dialog-init", this.data);
    this.createCanvas();
    if (this.data.imageUrl) {
      this.image && this.canvas.remove(this.image);
      fabric.Image.fromURL(this.data.imageUrl, (img) =>
        this.onImageLoaded(img), {crossOrigin: 'anonymous'});
    }
  }

  createCanvas() {
    console.log('createCanvas-cropper')
    if (this.canvas) {
      this.canvas.dispose();
    }

    if (this.data.ratio) {
      const element = document.querySelector("#image-cropper-canvas");
      const height = parseInt(element.getAttribute("height"))
      const width = this.data.ratio * height
      element.setAttribute("width", "" + width)
    }

    this.canvas = new fabric.Canvas("image-cropper-canvas", {
      fireRightClick: true,
      stopContextMenu: true,
      backgroundColor: "grey",
    });

    this.canvas.on("mouse:down", (e) => this.onMouseDown(e));
    this.canvas.on("mouse:up", (e) => this.onMouseUp(e));
  }

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
    console.log('onImageLoaded')
    this.image = img;
    this.canvas.add(img);
    
    const iw = this.image.width;
    const ih = this.image.height;
    const scale = Math.min(this.canvas.width / iw, this.canvas.height / ih)
    this.image.set({
      left: 0,
      top: 0,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
    });
    this.canvas.centerObject(this.image);
    this.canvas.renderAll();

    this.crop = {
      changed: false,
      left: this.image.left, 
      top: this.image.top, 
      scale: scale,
      brightness: 0,
      zoom: 1,
    }
  }

  addSelectionRect(left, top, width, height) {
    if (this.selectionRect) {
      this.canvas.remove(this.selectionRect);
    }

    height = (this.image.height * width) / this.image.width;
    if (this.data.ratio) {
      height = width / this.data.ratio
    }

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
    this.canvas.add(this.selectionRect);
  }

  onBrightnessChanged(e) {
    const el = document.getElementById("image-brightness-value");
    el.innerHTML = e.value;
    this.crop.brightness = e.value / 100;
    this.crop.changed = true

    var filter = new fabric.Image.filters.Brightness({
      brightness: this.crop.brightness,
    });
    this.image.filters = [filter];
    this.image.applyFilters();
    this.canvas.renderAll();
  }

  onImageSizeChanged(e) {
    const el = document.getElementById("image-size-value");
    el.innerHTML = e.value + "%";
    this.crop.zoom = e.value / 100;
    this.crop.changed = true

    const scale = this.crop.scale * this.crop.zoom
    this.image.set({
      left: this.crop.left - this.image.width * (scale - this.crop.scale) / 2,
      top: this.crop.top - this.image.height * (scale - this.crop.scale) / 2,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
    })
    this.canvas.renderAll()
  }

  onCropImage() {
    if (!this.selectionRect) {
      return
    }

    let scale = this.image.scaleX
    const rect = this.selectionRect;
    const left = (rect.left - this.image.left) / scale;
    const top = (rect.top - this.image.top) / scale;
    const width = rect.width / scale;
    const height = rect.height / scale;
    console.log('CrectRect', left, top, width, height);
    //this.collage.onImageCropped(left, top, width, height);

    scale = scale * this.canvas.height / rect.height
    this.crop.scale = scale
    this.crop.left = -1 * left * this.crop.scale
    this.crop.top = -1 * top * this.crop.scale
    this.crop.changed = true

    this.image.set({
      left: this.crop.left,
      top: this.crop.top,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
    })

    this.canvas.remove(this.selectionRect);
    this.selectionRect = null;
  }

  onApply() {
    if (this.crop.changed) {
      const imageScale = this.image.scaleX
      const scale = imageScale * this.data.width / this.canvas.width
      this.crop.left = this.image.left - this.image.width * (scale - imageScale) / 2,
      this.crop.top = this.image.top - this.image.height * (scale - imageScale) / 2,
      this.crop.scale = scale
      this.collage.onSmartImageCropped(this.crop);
    }
    if (this.selectionRect) {
      this.canvas.remove(this.selectionRect);
      this.selectionRect = null;
    }
    this.onClose()
  }

  onClose() {
    this.dialogRef.close();
  }
}
