import { Injectable } from "@angular/core"
import { ApiService } from "../api/api"
import { toDataURL } from "../collage/util"
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: "root",
})
export class Setting {
    grid: number = 15.0
    width: number = 12
    height: number = 12
    canvasWidth: number = 0
    canvasHeight: number = 0
    unitOfLength: string = "inch"
    landscape: boolean = false
    borderWidth: number = 1
    borderColor: string = "rgb(0,0,0)"
    mode: string = "auto"
    cells: number = 3
    margin: number = 15
    thumbImages: Array<object>
    wallImages: Array<object>
    savedObject: any = null

    setData(s: any) {
        this.unitOfLength = "inch"
        this.width = s.widthInch
        this.canvasWidth = s.canvasWidth
        this.canvasHeight = s.canvasHeight
        this.height = s.heightInch
        this.borderWidth = s.borderWidth
        this.borderColor = s.borderColor
        this.landscape = s.landscape
    }

    clone(): Setting {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }

    async updateUserImages(api: ApiService) {
        const urls = await api.getImages()
        this.thumbImages = await Promise.all(
            urls.map(async (url) => {
                const imageBase64 = await toDataURL("GET", url)
                return { url: url, imageBase64: imageBase64 }
            })
        )
    }

    async updateWallImages(api: ApiService) {
        const images = await api.getWallImageList()
        if (images) {
            const imageUrls = await api.getWallImageList()
            this.wallImages = await Promise.all(imageUrls.map(async (it) => {
                const url = environment.apiUrl + '/collage/wall-images/image/' + it
                const url_thumb = environment.apiUrl + '/collage/wall-images/thumb/' + it
                const imageBase64 = await toDataURL("GET", url_thumb)
                return { url, imageBase64 }
            }))
        }
    }

    getCanvasSizeText() {
        return `${this.width} x ${this.height} (${this.unitOfLength})`
    }

    getWidth() {
        if (this.unitOfLength == "feet") {
            return this.width * 12
        }
        return this.width
    }

    getHeight() {
        if (this.unitOfLength == "feet") {
            return this.height * 12
        }
        return this.height
    }
}
