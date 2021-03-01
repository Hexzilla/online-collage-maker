import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import {NgxImageCompressService} from 'ngx-image-compress';

import { GlobalsService } from '../../providers/globals-service';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  @ViewChild('canvasEls') canvasEls : any;

  showOption:boolean = false;
  premiumPost:boolean = false;
  scheduledLater:boolean = false
  myDate: any;
  showImagePicker = false;
  imagePicketTitle = '';
  imagePickerImageUrl = '';
  imagePickerType = '';
  imageUploading = false;
  newPostText= '';
  isChecked;

  imageData = {
    // uploadurl : encodeURI(this.globals.get('appConfig').apiUrl+'posts/create') 
  };
  myPicture = [];
  myPictureData = [];

  base64Image: any;

  files = [];
  newPostData = {};

  totalFilesSize = 0;
  uploadedFilesSize = 0;
  uploadedFilesPercent = 0;
  max = 100;
  current = 0;
  postAmount = 0;
  currentDate = new Date();

  fullPageLoading:boolean = false;

  compressArea:boolean = false;
  imgResultBeforeCompress;
  imgResultAfterCompress;
  img = new Image();
  canvas: any;
  ctx: any;
  crp: any;
  gImageHeight;
  gImageWidth;

  convertArea:boolean = false;
  imgResultBeforeConvert;

  showColorPicker:boolean = false;
  pngBGcolor = '#ffffff';

  constructor(public globals: GlobalsService, public sanitizer: DomSanitizer, private alertService: AlertService, public imageCompress: NgxImageCompressService){ 

  }

  aasass(){
    console.log("tas");
  }

  toggleShowOption(){
    this.showOption = !this.showOption;
  }

  makePremiumPost(e){
    // console.log(e);
    if(e.target.checked){
      this.premiumPost = true;
    } else {
      this.premiumPost = false;
    }
  }
  makeScheduledPost(e){
    if(e.target.checked){
      this.scheduledLater = true;
    } else {
      this.scheduledLater = false;
    }
  }

  showCompressArea(){
    this.convertArea = false;
    this.compressArea = !this.compressArea;
  }

  compressFile(compressAmount) {
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      this.imgResultBeforeCompress = image;
      console.log(image);
      console.log(orientation);
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));
      this.imageCompress.compressFile(image, orientation, compressAmount, compressAmount).then(
        result => {
          this.imgResultAfterCompress = result;
          //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));

          //this.fileupload function
          this.base64Image = this.sanitizer.bypassSecurityTrustUrl(this.imgResultAfterCompress);
          if(this.base64Image.changingThisBreaksApplicationSecurity){
            fetch(this.imgResultAfterCompress).then(res => res.blob()).then(blob => {
              const file = new File([blob], "filename"+this.files.length+".jpeg", {type: blob.type});
              console.log(blob.type);
              this.myPictureData.push(this.base64Image);
              this.files.push(file);
              this.totalFilesSize += blob.size;
            });
          }
          //this.fileupload function end

        }
      );
    });
  }


  compressMaintainingResolution(fileInput, extention){

    var reader = new FileReader();
    reader.readAsDataURL(fileInput.target.files[0]); 
    reader.onload = (_event) => { 
      
      this.imgResultBeforeCompress = reader.result; 
      this.transferImageToCanvas(extention, 'compress');
    }
  }

  showConvertArea(){
    this.convertArea = !this.convertArea;
    this.compressArea = false;
  }
  
  convertImage(fileInput, extention){
    //if Colorpicker checkbox is off then default will be white
    if(!this.showColorPicker){ 
      this.pngBGcolor = '#ffffff';
    }
    if(fileInput){
      var reader = new FileReader();
      reader.readAsDataURL(fileInput.target.files[0]); 
      reader.onload = (_event) => { 
        
        this.imgResultBeforeConvert = reader.result; 
        this.transferImageToCanvas(extention, 'convert');
      }
    }
  }


  transferImageToCanvas(extention, modeOfOperation){
    if(modeOfOperation == 'compress'){
      this.img.src = this.imgResultBeforeCompress;
    } else if(modeOfOperation == 'convert'){
      this.img.src = this.imgResultBeforeConvert;
    }
    //this.imageEditStates = [];
    
    this.canvas = this.canvasEls.nativeElement;
    this.ctx = this.canvas.getContext('2d'); 

    this.img.onload = () => {
      this.gImageHeight = this.img.height;
      this.gImageWidth = this.img.width;
      this.canvas.width = this.gImageWidth;
      this.canvas.height = this.gImageHeight;
      this.ctx.save();
      
      
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.gImageWidth, this.gImageHeight);
      if(modeOfOperation == 'convert'){
        this.ctx.fillStyle = this.pngBGcolor;
        this.ctx.fillRect( 0, 0, this.gImageWidth, this.gImageHeight);
      }
      //this.ctx.rotate(90 * Math.PI / 180);	
      this.ctx.drawImage(this.img, 0, 0, this.gImageWidth, this.gImageHeight);
      this.ctx.restore();
    };

    if(modeOfOperation == 'compress'){
      setTimeout(() => {
        this.imagePickerImageUrl = this.canvas.toDataURL(extention, 0.5);
        this.fileUpload();
      }, 1000);
    } else if(modeOfOperation == 'convert'){
      setTimeout(() => {
        this.imagePickerImageUrl = this.canvas.toDataURL(extention);
        this.fileUpload();
      }, 1000);
    }

  }



  // Which modal to show
  openImagePicker(value){
    this.compressArea = false;
    this.convertArea = false;
    this.imagePickerImageUrl = '';
    this.showImagePicker = true;
  }

  closeImagePicker(){
    this.showImagePicker = false;
    this.imagePickerImageUrl = '';
  }

  clickedOut(event) {
    if(event.target.className === 'modal-background') {
      this.closeImagePicker();
    } 
  }

  fileUpload(){
    this.base64Image = this.sanitizer.bypassSecurityTrustUrl(this.imagePickerImageUrl);
    // IF IMAGE SELECTED
    if(this.base64Image.changingThisBreaksApplicationSecurity){
      fetch(this.imagePickerImageUrl).then(res => res.blob()).then(blob => {
        const file = new File([blob], "filename"+this.files.length+".jpeg", {type: blob.type});
        this.myPictureData.push(this.base64Image);
        this.files.push(file);
        this.totalFilesSize += blob.size;
      });
    }
  }

  onVideoFileSelected(files, event: any){

    this.compressArea = false;
    this.convertArea = false;

    if (files.length === 0){
      return;
    }
    let selectedFile: File = files[0];
    var mimeType = selectedFile.type;
    if (mimeType.match(/video\/*/) == null) {
      console.log(1);
      this.globals.showErrorAlert("Only videos are supported.");
      return;
    }
    if(selectedFile.size > 4000000) {
      console.log(2);
      this.globals.showErrorAlert("File size should be within 4 MB.");
      return;
    }
    var reader = new FileReader();
    reader.readAsArrayBuffer(selectedFile); 
    reader.onload = (_event) => { 
      // this.imagePickerImageUrl = reader.result; 
      // this.initCanvas();
      console.log('selectedFile', selectedFile);
      console.log('reader.result', reader.result);


      var blob = new Blob([reader.result], {type: selectedFile.type});
      var url = URL.createObjectURL(blob);
      var video = document.createElement('video');
      // var self = this;
      var timeupdate = function() {
        if (snapImage(video, url)) {
          video.removeEventListener('timeupdate', timeupdate);
          video.pause();
        }
      };
      video.addEventListener('loadeddata', () => {
        let snapImageData = snapImage(video, url);
        if (snapImageData) {
          this.myPictureData.push(snapImageData);
          video.removeEventListener('timeupdate', timeupdate);
        }
      });
      video.addEventListener('timeupdate', timeupdate);
        video.preload = 'metadata';
        video.src = url;
        // Load video in Safari / IE11
        video.muted = true;
        // video.playsInline = true;
        video.play();
      };
    

      var snapImage = function(video, url) {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        var image = canvas.toDataURL();
        var success = image.length > 100000;
        if (success) {
          // var img = document.createElement('img');
          // img.src = image;
          // document.getElementsByTagName('div')[0].appendChild(img);
          
          // this.myPictureData.push(image);
          URL.revokeObjectURL(url);
          return image;
        }
        return false;
      };


      
      this.files.push(selectedFile);
      this.totalFilesSize += selectedFile.size;

  }

 

  createPost = function(posttype) {
    console.log('this is an info alert');
    if(posttype == 'notDraft') {
      this.alertService.success('You have clicked post button');
    } else {
      this.alertService.success('You have clicked Save as draft button');
    }
  }; 


  computeOverallUploadProgress(fileInfo) {

    var uploadId = parseInt(fileInfo.uploadId.substr(2));
    console.log(uploadId);
    this.files[uploadId].uploadedFileSize = (typeof fileInfo.sent == typeof undefined ? fileInfo.wrote : fileInfo.sent);
    var uploadedFilesSize = 0;
    this.files.forEach(element => {

      uploadedFilesSize +=  element.uploadedFileSize;
    });
    this.uploadedFilesSize = uploadedFilesSize;

    this.uploadedFilesPercent = Math.floor(this.uploadedFilesSize / this.totalFilesSize * 100);
    this.current = this.uploadedFilesPercent;
    if(this.current == this.max) {
      // this.globals.changeLoaderText('Posting ...');
    } else {
      // this.globals.changeLoaderText('Uploading Media ' + this.current + '% ...');
    }

  }

  removeImage(index){
  this.myPictureData.splice(index, 1);
  this.myPicture.splice(index, 1);
  this.files.splice(index, 1);
  }

  ngOnInit() {
  }

}
