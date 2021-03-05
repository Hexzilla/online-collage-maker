import { Injectable } from "@angular/core"
import { ApiService } from "../api/api"
import { toDataURL } from "../collage/util"

@Injectable({
    providedIn: "root",
})
export class Setting {
    grid: number = 15.0
    canvasWidth: number = 12
    canvasHeight: number = 12
    unitOfLength: string = "inch"
    landscape: boolean = false
    borderWidth: number = 1
    borderColor: string = "rgb(0,0,0)"
    mode: string = "auto"
    cells: number = 3
    margin: number = 15
    thumbImages: Array<object>
    savedTemplate: any = null
    savedWallFrames: any = null

    async updateUserImages(api: ApiService) {
        const urls = await api.getImages()
        this.thumbImages = await Promise.all(
            urls.map(async (url) => {
                const imageBase64 = await toDataURL("GET", url)
                return { url: url, imageBase64: imageBase64 }
            })
        )
    }

    getCanvasSizeText() {
        return `${this.canvasWidth} x ${this.canvasHeight} (${this.unitOfLength})`
    }

    getWidth() {
        if (this.unitOfLength == "feet") {
            return this.canvasWidth * 12
        }
        return this.canvasWidth
    }

    getHeight() {
        if (this.unitOfLength == "feet") {
            return this.canvasHeight * 12
        }
        return this.canvasHeight
    }
}
