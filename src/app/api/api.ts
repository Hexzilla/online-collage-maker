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
                images.push(src);
            }
            return images;
        } catch (e) {
            console.log(e);
        }
        return [];
    }

    async getImageList() {
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

    async deleteImage(url) {
        console.log(url);
        try {
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

    createCollageImageData(userId, dataUrl, width, height) {
        return {
            userId: userId,
            title: 'Online Collage Image',
            image: dataUrl,
            width: width,
            height: height,
            basePrice: 0,
            short_description: userId,
            description: 'Online Collage Image',
            categories: {
                userId: userId,
                title: 'Online Collage Image'
            },
            visible: 'Yes',
        }
    }

    async saveCollageImage(userId, dataUrl, width, height) {
        try {
            const url = environment.apiUrl + "/collage/image/save";
            const data = this.createCollageImageData(userId, dataUrl, width, height)
            return await this.http.post(url, data).toPromise();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async updateCollageImage(collageId, userId, dataUrl, width, height) {
        try {
            const url = environment.apiUrl + "/collage/image/update/" + collageId;
            const data = this.createCollageImageData(userId, dataUrl, width, height)
            return await this.http.post(url, { data: data }).toPromise();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async deleteCollageImage(collageId) {
        try {
            const url = environment.apiUrl + "/collage/image/delete";
            const data = {
                collageId: collageId
            }
            return await this.http.post(url, data).toPromise();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async getCollageImages(userId) {
        try {
            const url = environment.apiUrl + "/collage/image/preview/" + userId;
            return await this.http.post(url, null).toPromise();
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    async saveTemplate(data) {
        try {
            const url = environment.apiUrl + "/collage/templates/save";
            const response = await this.http.post(url, data).toPromise();
            if (response['success'] == true) {
                return response['data']
            }
        } catch (e) {
            console.log(e);
        }
        return null;
    }

    async deleteTemplate(templateId) {
        try {
            const url = environment.apiUrl + "/collage/templates/delete/" + templateId;
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
