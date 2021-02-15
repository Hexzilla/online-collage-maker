import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from "../auth.service";
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: "root",
})
export class ApiService {
    constructor(private http: HttpClient, private authService: AuthService) {
        console.log(environment.apiUrl);
    }

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        }),
    };

    getUserId() {
        return this.authService.getUserId()
    }

    async getImages() {
        let images = [];
        try {
            const url = environment.apiUrl + "/collage/images/list/" + this.getUserId();
            const items = await this.http.get(url).toPromise();
            for (let key in items) {
                const src = environment.apiUrl + items[key];
                console.log("getImage", src);
                images.push(src);
            }
            return images;
        } catch (e) {
            console.log(e);
        }
        return [];
    }

    async getData() {
        const images = await this.getImages();
        return {
            images: images.map((it, index) => {
                return {
                    data: index + 1,
                    src: it,
                };
            }),
        };
    }

    async deleteImage(image) {
        try {
            const url = environment.apiUrl + "/collage/images/" + this.getUserId() + "/" + image;
            const result = await this.http.delete(url).toPromise();
            if (result == 1) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async uploadFiles(formData) {
        try {
            //const url = "http://localhost:8080/collage/images/upload"
            const url = environment.apiUrl + "/collage/images/upload";
            formData.append("user_id", this.getUserId());

            const result = await this.http.post(url, formData).toPromise();
            if (result == 1) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async createTemplate(data) {
        try {
            const url = environment.apiUrl + "/collage/template/create";
            const result = await this.http.post(url, data).toPromise();
            if (result == 1) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async deleteTemplate(templateId) {
        try {
            const url = environment.apiUrl + "/collage/template/delete/" + templateId;
            const result = await this.http.delete(url).toPromise();
            if (result == 1) {
                return true;
            }
        } catch (e) {
            console.log(e);
        }
        return false;
    }
}
