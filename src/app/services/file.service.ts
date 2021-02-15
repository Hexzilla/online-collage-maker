import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  downloadFile(file: string) {
    const body = { filename: file };

    return this.http.post(environment.url + '/file/download', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  uploadFile(file: File) {
    const fd = new FormData();
    fd.append('image', file, file.name);
    return this.http.post(environment.url + '/file/upload', fd, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
