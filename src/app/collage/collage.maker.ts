import { CanvasLayout } from "./cavas-layout";
import { Collage } from "./collage.service";
import { loadImage, shuffle } from "./util";

export async function createAutoCollage(collage: Collage) {
  try {
    collage.setLoadingState(true);
    collage.resetSavedCollage()
    collage.removeCanvasElement()

    const res = await collage.getApiSvc().getImageList();
    if (!res || !res.images || !res.images.length) {
      return
    }

    const setting = collage.getSetting()//TODO Unit
    const layout = new CanvasLayout(setting)

    const shuffledImages = shuffle(res.images);
    const images = await Promise.all(shuffledImages.map(async (item) => {
        const image = await loadImage(item.src);
        return Object.assign(item, {
          image: image,
          ratio: image['width'] / image['height'],
        });
      })
    )
    console.log("LoadImage, Completed")

    // Get perfect layouts
    const canvasWidth = layout.getCanvasWidthInPixel();
    const perfectRows = layout.getCanvasLayout(images);
    const layoutItems = layout.getLayoutItems(images, perfectRows, canvasWidth, setting.borderWidth);
    const sumOfHeight = layoutItems.reduce((accumulator, item) => {
      return Math.max(accumulator, item.top + item.height);
    }, 0);

    // Create canvas and fabric
    const canvasHeight = setting.borderWidth + sumOfHeight
    collage.createCanvasElement(canvasWidth, canvasHeight)
    collage.createFabricCanvas(canvasWidth, canvasHeight)

    // Add images to canvas.
    collage.removeImageBoxs()
    layoutItems.forEach(data => {
      const tag = `img_${data.col}_${data.row}`
      const box = collage.createSimpleImageBox()
        .setTag(tag)
        .setBorder(setting.borderWidth, setting.borderColor)
        .setImageUrl(data.img.src)
        .loadImage(data.img.src)
        .addMovableBoard(data.left, data.top, data.width, data.height)
      collage.addImageBox(tag, box)
    })
  }
  catch (err) {
    console.log(err)
  }
  finally {
    collage.setLoadingState(false);
  }
}

export async function createCollageByTemplateId(collage: Collage, templateId: number) {
  try {
    collage.setLoadingState(true);
    
    const template = await collage.getApiSvc().getTemplateById(templateId)
    if (!template) {
      return
    }
    console.log('Selected Template: ', template)

    collage.resetSavedCollage()
    collage.removeCanvasElement()

    const setting = collage.getSetting()
    setting.setData(template.setting)
    const layout = new CanvasLayout(setting)

    const canvasWidth = layout.getCanvasWidthInPixel()
    const canvasHeight = setting.canvasHeight * canvasWidth / setting.canvasWidth
    const scale = canvasWidth / setting.canvasWidth
    collage.createCanvasElement(canvasWidth, canvasHeight)
    collage.createFabricCanvas(canvasWidth, canvasHeight)

    // Add images to canvas.
    collage.removeImageBoxs()
    template.images.forEach(it => {
      const tag = `img_${it.index}`
      const box = collage.createSimpleImageBox()
        .setTag(tag)
        .setBorder(setting.borderWidth, setting.borderColor)
        .addLockedBoard(it.left * scale, it.top * scale, it.width * scale, it.height * scale)
      collage.addImageBox(tag, box)
    })
  }
  catch (err) {
    console.log(err)
  }
  finally {
    collage.setLoadingState(false);
  }
}

export async function createCollageByWallId(collage: Collage, wallId: number) {
  try {
    collage.setLoadingState(true);

    const wall = await collage.getApiSvc().getWallById(wallId)
    console.log('WallFrame', wall)
    if (!wall) {
      return
    }

    collage.resetSavedCollage()
    collage.removeCanvasElement()

    //convert feet to inch
    wall.setting.widthInch *= 12;
    wall.setting.heightInch *= 12;

    const setting = collage.getSetting()
    setting.setData(wall.setting)
    const layout = new CanvasLayout(setting)

    const canvasWidth = layout.getCanvasWidthInPixel()
    const canvasHeight = setting.canvasHeight * canvasWidth / setting.canvasWidth
    const scale = canvasWidth / setting.canvasWidth
    collage.createCanvasElement(canvasWidth, canvasHeight)
    collage.createFabricCanvas(canvasWidth, canvasHeight)

    // Add images to canvas.
    collage.removeImageBoxs()
    wall.images.forEach(it => {
      const tag = `img_${it.index}`
      const box = collage.createSimpleImageBox()
        .setTag(tag)
        .setBorder(setting.borderWidth, setting.borderColor)
        //.setSizeInch(it.showWidth, it.showHeight)
        //.setPrice(it.price)
        .addWallFrameBoard(it.left * scale, it.top * scale, it.width * scale, it.height * scale)

      box['price'] = it.price
      box['showWidth'] = it.showWidth
      box['showHeight'] = it.showHeight
      collage.addImageBox(tag, box)
      collage.setObjectMoveEvent(box)
    })

    const pixelsForInch = layout.getPixelForInch()
    collage.drawFrameSize(pixelsForInch);
  }
  catch (err) {
    console.log(err)
  }
  finally {
    collage.setLoadingState(false);
  }
}