import { Injectable } from '@angular/core';

declare var navigator:any;
declare var window:any;

@Injectable()
export class VideoService {
	localStream = null;
	facing = 'front';
	videoCall = true;

	constructor() {
		navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
	}

	connect(audio, video, facing) {
		let self = this;
		return new Promise((resolve, reject) => {
			var connect = async () => {
				var videoOptions = {
					deviceId: null,
				};
				var availableDevices = await getDevices();
				if(availableDevices.length) {
					videoOptions.deviceId = availableDevices[0].deviceId;
				}
				this.videoCall = video;
				navigator.getUserMedia({
				audio: audio ? { volume: 0.4 } : false,
				video: video ? videoOptions : false
				}, stream => {
					//console.log('got local MediaStream: ', stream, stream.getTracks());
					this.localStream = stream;
					resolve(stream);
				}, error => {
					//console.error('getUserMedia failed: ', error);
					reject();
				});	
			};
			var getDevices = async() => {
				var videoDevices = [];
				try {
					var devices = await navigator.mediaDevices.enumerateDevices();
					devices.forEach(device => {
						if(device.kind === 'videoinput') {
							videoDevices.push(device);
						}
					});
				} catch(e) {

				}
				return videoDevices;
			};
			if (this.localStream) {
				self.disconnect().then(connect);
			} else {
				connect();
			}
		});
	}

	// get a list of devices
	devices() {
		return new Promise((resolve, reject) => {
			navigator.mediaDevices.enumerateDevices().then(devices => {
				resolve(devices.filter(device => device.kind === 'videoinput'));
			}, err => {
				reject(err);
			});
		});
	}

	selectCameraDevice() {
		
	}
	
	disconnect() {
		return new Promise((resolve, reject) => {
			if (this.localStream) {
				this.localStream.getTracks().forEach(track => {
					track.stop();
				}); 
				this.localStream = null;
			}
			resolve();
		});
	}
}