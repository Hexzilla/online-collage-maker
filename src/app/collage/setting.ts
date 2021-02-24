import { Injectable } from "@angular/core";
import { ApiService } from "../api/api";
import { toDataURL } from "../collage/util";

@Injectable({
    providedIn: "root",
})
export class Setting {
    widthInch: number = 16;
    heightInch: number = 12;
    landscape: boolean = false;
    borderWidth: number = 0;
    borderColor: string = "rgb(0,0,0)";
    mode: string = "auto";
    cells: number = 3;
    margin: number = 15;
    thumbImages: Array<object>;

    async updateUserImages(api: ApiService) {
        const urls = await api.getImages();
        this.thumbImages = await Promise.all(
            urls.map(async (url) => {
                const imageBase64 = await toDataURL("GET", url);
                return { url: url, imageBase64: imageBase64 };
            })
        );
    }
}
