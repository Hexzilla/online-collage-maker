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
