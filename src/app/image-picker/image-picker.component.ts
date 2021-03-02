import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';


import { GlobalsService } from './../../providers/globals-service';
import { VideoService } from './../../providers/video-service';


declare var Caman: any;
declare var Cropper: any;

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})  

export class ImagePickerComponent implements OnInit {

  @Input() cropRatio: number;
  @Input() showImagePicker: boolean;
  @Output() showImagePickerChange = new EventEmitter<boolean>();
  @Input() imagePickerImageUrl: any;
  @Output() imagePickerImageUrlChange = new EventEmitter<any>();
  @ViewChild('canvasEl') canvasEl : any;
  @ViewChild('videoPreviewEl') videoPreviewEl : any;
  @ViewChild('capturedImageEl') capturedImageEl : any;

  


  isCameraAvalilable = false;

  videoWidth = 0;
  videoHeight = 0;

  fileName = '';
	fileType = '';
	img = new Image();
	orgImgSrc = '';
  imageEditStates = [];
  canvas: any;
	ctx: any;
	crp: any;
  gImageHeight= 0;
  gImageWidth = 0;

  cameraMode = false;
  cropMode = false;
  filterMode = false;
  rotateMode = false;
  mirrorMode = false;
  adjustMode = false;
  isMirrored = false;
  rotateDegrees = 0;
  angleInDegrees = 0;
  imageProcessing = false;

  constructor(private renderer: Renderer2, public globals: GlobalsService, public video: VideoService) {
    this.video.devices().then((devices: any) => {
      if(devices.length) {
        this.isCameraAvalilable = true;
      } 
    }, err => {

    })
  }

  files: any = [];

  uploadFile(event) {
    console.log(event);
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }  
  }
  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  ngOnInit() {
		if (this.imagePickerImageUrl) {
      this.initCanvas();
    }
  }

  ngAfterViewInit() {
    
  }

  openCamera(){
    this.cameraMode = true;
    this.video.connect(false, true, true).then(stream => {
      this.renderer.setProperty(this.videoPreviewEl.nativeElement, 'srcObject', stream);
      this.renderer.listen(this.videoPreviewEl.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoPreviewEl.nativeElement.videoHeight;
        this.videoWidth = this.videoPreviewEl.nativeElement.videoWidth;
    });
		}, err => {
      this.closeCamera();
      this.globals.showErrorAlert("camera not available.");

		});
  }

  capturePhoto() {
    this.renderer.setProperty(this.capturedImageEl.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.capturedImageEl.nativeElement, 'height', this.videoHeight);
    this.capturedImageEl.nativeElement.getContext('2d').drawImage(this.videoPreviewEl.nativeElement, 0, 0);
    this.imagePickerImageUrl = this.capturedImageEl.nativeElement.toDataURL();
    this.closeCamera();
    this.initCanvas();
  }

  closeCamera() {
    this.video.disconnect().then(() => {
      // console.log(this.videoPreviewEl);
      // this.videoPreviewEl.nativeElement.pause();
			this.cameraMode = false;
		});
  }

  onFileSelected(files){
    if (files.length === 0){
      return;
    }
    let selectedFile = files[0];
    var mimeType = selectedFile.type;
    if (mimeType.match(/image\/*/) == null) {
      this.globals.showErrorAlert("Only images are supported.");
      // this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(selectedFile); 
    reader.onload = (_event) => { 
      
      this.imagePickerImageUrl = reader.result; 
      console.log(this.imagePickerImageUrl);
      this.initCanvas();
    }
  }

  initCanvas() {
    setTimeout(() => {
      this.img.src = this.imagePickerImageUrl;
      //this.imageEditStates = [];
      
      this.canvas = this.canvasEl.nativeElement;
      this.ctx = this.canvas.getContext('2d'); 
      this.img.onload = () => {
        this.gImageHeight = this.img.height;
        this.gImageWidth = this.img.width;
        this.canvas.width = this.gImageWidth;
        this.canvas.height = this.gImageHeight;
        this.ctx.save();
        
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.gImageWidth, this.gImageHeight);
        //this.ctx.rotate(90 * Math.PI / 180);	
        this.ctx.drawImage(this.img, 0, 0, this.gImageWidth, this.gImageHeight);
        this.ctx.restore();
        //this.imageEditStates.push(this.img.src);
        Caman('#canvas', function () {
          this.reloadCanvasData();
          this.brightness(0).render(function() {
            this.initCanvas();
          });
        });
      };
      /*Caman.Event.listen("processStart", (job) => {
        this.imageProcessing = true;
      });
      Caman.Event.listen("processComplete", (job) => {
        this.imageProcessing = false;
      });*/
    });
  }

  cropWithRatio(ratio){
    // if(ratio == 'free'){
    //   ratio = 'Nan'
    // }
    this.crp.destroy();
    this.crp = new Cropper(this.canvas,{aspectRatio: ratio});
    this.cropMode = true;
  }

  enableCropMode(){
    this.crp = new Cropper(this.canvas,{aspectRatio: this.cropRatio});
    this.cropMode = true;
  }

  applyCrop() {
    var croppedImageData = this.crp.getCroppedCanvas().toDataURL(this.fileType);
    this.img.src = croppedImageData;
    this.crp.destroy();
    Caman('#canvas', function () {
      this.reloadCanvasData();
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.cropMode = false;
  }

  cancelCrop() {
    this.crp.destroy();
    this.cropMode = false;
  }

  enableFilterMode(){
    this.filterMode = true;
  }

  enableMirrorMode(){
    this.mirrorMode = true;
  }

  mirror(){
    
    this.isMirrored = !this.isMirrored;
    console.log(this.isMirrored);
    if(this.isMirrored){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.widthheight);
      this.ctx.save();
      this.ctx.scale(-1, 1); //for Horizonal
      this.ctx.drawImage(this.img, -this.img.width, 0); //for Horizonal
      console.log("mirror");
    } else {
      Caman('#canvas', function () {
        this.brightness(0).render(function() {
          this.initCanvas();
        });
      });
    }
    this.ctx.restore();
  }

  mirrorVertical(){
    this.isMirrored = !this.isMirrored;
    console.log(this.isMirrored);
    if(this.isMirrored){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.widthheight);
      this.ctx.save();
      this.ctx.scale(1, -1); //for vertical
      this.ctx.drawImage(this.img, 0, -this.img.height); //for vertical
      console.log("mirror");
    } else {
      Caman('#canvas', function () {
        this.brightness(0).render(function() {
          this.initCanvas();
        });
      });
    }
    this.ctx.restore();
  }

  applyMirror(){
    this.img.src = this.canvas.toDataURL(this.fileType);
    Caman('#canvas', function () {
      this.reloadCanvasData();
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.mirrorMode = false;
    this.isMirrored = false;
  }

  cancelMirror() {
    Caman('#canvas', function () {
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.mirrorMode = false;
    this.isMirrored = false;
  }
  
  // ADJUST MODE
  
  enableAdjustMode(){
    this.adjustMode = true;
  }

  decreaseBrightness(){
    Caman("#canvas", function () {
      this.brightness(-5).render();
    });
  }

  increaseBrightness(){
    Caman("#canvas", function () {
      this.brightness(5).render();
    });
  }

  decreaseContrast(){
    Caman("#canvas", function () {
      this.contrast(-5).render();
    });
  }

  increaseContrast(){
    Caman("#canvas", function () {
      this.contrast(5).render();
    });
  }

  decreaseExposure(){
    Caman("#canvas", function () {
      this.exposure(-5).render();
    });
  }

  increaseExposure(){
    Caman("#canvas", function () {
      this.exposure(5).render();
    });
  }

  decreaseSaturation(){
    Caman("#canvas", function () {
      this.saturation(-5).render();
    });
  }

  increaseSaturation(){
    Caman("#canvas", function () {
      this.saturation(5).render();
    });
  }

  decreaseVibrance(){
    Caman("#canvas", function () {
      this.vibrance(-5).render();
    });
  }

  increaseVibrance(){
    Caman("#canvas", function () {
      this.vibrance(5).render();
    });
  }

  invertImage(){
    Caman("#canvas", function () {
      this.invert().render();
    });
  }

  applySepia(){
    Caman("#canvas", function () {
      this.sepia(50).render();
    });
  }

  applyNoise(){
    Caman("#canvas", function () {
      this.noise(5).render();
    });
  }

  applyAdjust(){
    Caman('#canvas', function () {
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.adjustMode = false;
  }

  cancelAdjust(){
    Caman('#canvas', function () {
      this.revert();
    });
    this.adjustMode = false;
  }

  // ADJUST MODE END

  enableRotateMode(){
    this.rotateMode = true;
    this.rotateDegrees = 0;
  }

  rotateClockwise(){
    this.angleInDegrees+= 90 % 360;
    //console.log(this.angleInDegrees);
    this.rotate(this.angleInDegrees);
    if(this.angleInDegrees == 360){
      this.angleInDegrees = 0
    }
  }

  

  rotate(degrees){
    if(degrees == 90  || degrees == 270) {
      this.canvas.width = this.img.height;
      this.canvas.height = this.img.width;
      } else {
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
      }

    //this.rotateDegrees += degrees;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if(degrees == 90 || degrees == 270) {
      this.ctx.translate(this.img.height/2,this.img.width/2);
      } else {
        this.ctx.translate(this.img.width/2,this.img.height/2);
     }

    this.ctx.rotate(degrees*Math.PI/180);


    this.ctx.drawImage(this.img,-this.img.width/2,-this.img.height/2);

    this.ctx.restore();
  }

  applyRotate(){
    this.img.src = this.canvas.toDataURL(this.fileType);
    Caman('#canvas', function () {
      this.reloadCanvasData();
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.rotateMode = false;
    this.rotateDegrees = 0;
  }

  cancelRotate() {
    //this.img.src = this.canvas.toDataURL(this.fileType);
    // Caman('#canvas', function () {
    //   this.reloadCanvasData();
    //   this.brightness(0).render(function() {
    //     this.initCanvas();
    //   });
    // });
    Caman('#canvas', function () {
      this.revert();
    });
    this.rotateMode = false;
    this.rotateDegrees = 0;
  }



  applyFilter() {
    Caman('#canvas', function () {
      this.brightness(0).render(function() {
        this.initCanvas();
      });
    });
    this.filterMode = false;
  }

  cancelFilter() {
    Caman('#canvas', function () {
      this.revert();
    });
    this.filterMode = false;
  }

  filterAuto() {
    Caman("#canvas", function () {
      this.revert();
      this.auto().render();
    });
  }			
    
  filterGrayscale() {		
    Caman("#canvas", function () {
      this.revert();
      this.greyscale().render();
    });
  }	
  
  filterInvert() {			
    Caman("#canvas", function () {
      this.revert();
      this.invert().render();
    });
  }

  filterNostalgia() {			
    Caman('#canvas', this.img, function () {
      this.revert();
      this.nostalgia().render();
    });
  }

  filterMajestic() {			
    Caman('#canvas', this.img, function () {
      this.revert();
      this.herMajesty().render();
    });
  }
  
  filterLomo() {			
    Caman('#canvas', this.img, function () {
      this.revert();
      this.lomo().render();
    });
  }

  filterSincity() {			
    Caman('#canvas', this.img, function () {
      this.revert();
      this.sinCity().render();
    });
  }
  
  filterSepia() {			
    Caman('#canvas', this.img, function () {
      this.revert();
      this.sepia(50).render();
    });
  }

  filterPinhole() {	
    Caman("#canvas", this.img, function () {
      this.revert();
      this.pinhole().render();
    });
  }

  filterClarity() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.clarity().render();
    });
  }
  
  filterSunrise() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.sunrise().render();
    });
  }
  
  filterGrungy() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.grungy().render();
    });
  }

    
  filterJarques() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.jarques().render();
    });
  }

  filterOldBoot() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.oldBoot().render();
    });
  }
  
  filterHemingway() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.hemingway().render();
    });
  }
  
  filterConcentrate() {
    Caman("#canvas", this.img, function () {
      this.revert();
      this.concentrate().render();
    });
  }
  
  filterGlowingSun() {		
    Caman("#canvas", this.img, function () {
      this.revert();
      this.glowingSun().render();
    });
  }	

  submitImage() {
    this.imagePickerImageUrl = this.canvas.toDataURL("image/jpeg");
    this.imagePickerImageUrlChange.emit({
      "action": "change",
      "image": this.imagePickerImageUrl
    });
    this.showImagePicker = false;
    this.showImagePickerChange.emit(this.showImagePicker);
  }

  close() {
    this.imagePickerImageUrlChange.emit({
      "action": "close"
    });
  }

  uploadImage(){
    this.imagePickerImageUrl = this.canvas.toDataURL("image/jpeg");
    this.imagePickerImageUrlChange.emit({
      "action": "upload",
      "image": this.imagePickerImageUrl
    });
  }

  downloadImage(){
    //to download the image 
    var lnk = document.createElement('a'), e; 
    lnk.download = 'myimage.jpg'; 
    lnk.href = this.canvas.toDataURL("image/jpg;base64"); 
    if (document.createEvent) { 
      e = document.createEvent("MouseEvents");
      e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      lnk.dispatchEvent(e);
    } 

    // open image in a new tab
    var image = this.canvas.toDataURL("image/jpg");
    var newTab = window.open();
    newTab.document.body.innerHTML = '<img src="'+image+'">';
  }

  closeImagePicker() {
    this.imagePickerImageUrl = '';
    this.imagePickerImageUrlChange.emit(this.imagePickerImageUrl);
    this.showImagePicker = false;
    this.showImagePickerChange.emit(this.showImagePicker);
  }

}
