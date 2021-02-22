import { Component, Inject, OnInit, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { fabric } from "fabric";
import { Collage } from "../collage/collage";
import { toDataURL } from "../collage/util";

export interface ImageData {
  imageUrl: string;
  ratio: number;
  boardWidth: number;
  boardHeight: number;
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
  selector: "image-cropper-wrapper",
  templateUrl: "image-cropper.component.html",
  styleUrls: ["image-editor.component.scss"],
})
export class ImageCropperComponent implements OnInit {
  canvas: fabric.Canvas;
  image: fabric.Image;
  crop: ImageCrop;
  selectionRect: fabric.Rect;
  startPoint: fabric.Point;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData,
    private collage: Collage
  ) { 
  }

  ngOnInit() {
    /*if (this.data.imageUrl) {
      this.image && this.canvas.remove(this.image);
      fabric.Image.fromURL(this.data.imageUrl, (img) =>
        this.onImageLoaded(img), {crossOrigin: 'anonymous'});
    }*/
    this.croppedImage = this.data.imageUrl
    
    toDataURL(this.data.imageUrl, (dataUrl) => {
      console.log(dataUrl)
      this.imageChangedEvent = dataUrl
    })
  }

  createCanvas() {
    if (this.canvas) {
      this.canvas.dispose();
    }
   
    const ratio = this.image.width / this.image.height
    const element = document.querySelector("#image-cropper-canvas");
    const height = parseInt(element.getAttribute("height"))
    const width = ratio * height
    element.setAttribute("width", "" + width)

    this.canvas = new fabric.Canvas("image-cropper-canvas", {
      fireRightClick: true,
      stopContextMenu: true,
      backgroundColor: "grey",
    });

    //this.canvas.on("mouse:down", (e) => this.onMouseDown(e));
    //this.canvas.on("mouse:up", (e) => this.onMouseUp(e));

    const container = document.querySelector(".crop-container > .canvas-container") as HTMLElement
    container.style.textAlign = "center"
    container.style.margin = "0px auto"
    container.style.backgroundColor = "#111"
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
    this.image = img;

    this.createCanvas()
    this.canvas.add(img)
    
    const iw = this.image.width;
    const ih = this.image.height;
    const scale = Math.min(this.canvas.width / iw, this.canvas.height / ih)
    console.log("sssscale=", scale)
    this.image.set({
      left: 0,
      top: 0,
      scaleX: scale,
      scaleY: scale,
      selectable: false,
    });
    this.canvas.centerObject(this.image);
    this.canvas.renderAll();

    let bw = this.image.width * scale
    let bh = this.image.height * scale
    if (this.data.ratio > 1.0) {
      if (this.image.width > this.image.height) bh = 1 / this.data.ratio * bw
      else bw = this.data.ratio * bh
    }
    else {
      if (this.image.width > this.image.height) bw = this.data.ratio * bh
      else bh = 1 / this.data.ratio * bw
    }

    const offset = Math.min(this.image.width, this.image.height) / 16
    this.addSelectionRect(offset, offset, bw - offset, bh - offset);
    this.canvas.centerObject(this.selectionRect)
    this.canvas.setActiveObject(this.selectionRect)

    this.crop = {
      changed: false,
      left: 20, 
      top: 20,
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
      cornerSize: 8,
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

  /*onCropImage() {
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
  }*/

  onApply() {
    const imageScale = this.image.scaleX
    console.log('Image', this.image.left, this.image.top, this.image.scaleX)
    const rect = this.selectionRect;
    console.log('Rect', rect.left, rect.top, rect.width, rect.height, "Rect.Ratio", rect.width / rect.height)

    const left = (rect.left - this.image.left) / imageScale;
    const top = (rect.top - this.image.top) / imageScale;
    console.log(left, top)

    const ir = Math.max(this.image.height * imageScale / rect.height, this.image.width * imageScale / rect.width)
    const ratio = this.data.boardWidth / rect.width
    console.log("boardWidth", this.data.boardWidth, ratio, "Ratio", this.data.ratio)
    const scale = imageScale * ratio * ir
    console.log("scale", scale)
    this.crop.left = -1 * left * scale
    this.crop.top = -1 * top * scale
    this.crop.scale = scale
    this.collage.onSmartImageCropped(this.crop);

    this.canvas.remove(this.selectionRect);
    this.selectionRect = null;
    this.onClose()
  }

  onClose() {
    this.dialogRef.close();
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }
  cropperReady() {
      // cropper ready
      console.log("cropperReady")
  }
  loadImageFailed() {
      // show message
      console.log("loadImageFailed")
  }
}
