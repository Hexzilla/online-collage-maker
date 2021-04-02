import { environment } from 'src/environments/environment';
import { ApiService } from "../api/api";
import { toDataURL } from "./util"

export class ImageService {
  public thumbImages: Array<object> = []

  constructor(protected api: ApiService) {

  }

  async uploadImage(formData) {
    console.log("Upload-2");
    return await this.api.uploadImage(formData)
  }

  uploadCollageImages(formData) {
    return this.api.uploadCollageImages(formData)
  }

  async updateImages() {
    const urls = await this.api.getImages()
    this.thumbImages = await Promise.all(
      urls.map(async (url) => {
          const imageBase64 = await toDataURL("GET", url)
          return { url: url, imageBase64: imageBase64 }
      })
    )
    return this.thumbImages
  }
}

export class WallImageService extends ImageService {
  async uploadImage(formData) {
    return await this.api.uploadWallImage(formData)
  }

  async updateImages() {
    const imageUrls = await this.api.getWallImageList()
    if (imageUrls) {
      this.thumbImages = await Promise.all(imageUrls.map(async (it) => {
          const url = environment.apiUrl + '/collage/wall-images/image/' + it
          const url_thumb = environment.apiUrl + '/collage/wall-images/thumb/' + it
          const imageBase64 = await toDataURL("GET", url_thumb)
          return { url, imageBase64 }
      }))
    }
    return this.thumbImages
  }
}
