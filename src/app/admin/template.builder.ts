import { CanvasLayout } from "../collage/cavas-layout";
import { Collage } from "../collage/collage.service";

export async function createTemplate(collage: Collage) {
  try {
    const setting = collage.getSetting()
    setting.savedObject = null

    collage.removeImageBoxs()
    collage.resetSavedCollage()
    collage.removeCanvasElement()

    const layout = new CanvasLayout(setting)
    const canvasWidth = layout.getCanvasWidthInPixel();
    const canvasHeight = canvasWidth * setting.getHeight() / setting.getWidth();
    collage.createCanvasElement(canvasWidth, canvasHeight)
    collage.createFabricCanvas(canvasWidth, canvasHeight)
    collage.drawGridLines()

    const grid = setting.grid
    const margin = Math.ceil(setting.margin / grid) * grid
    const width = Math.floor((canvasWidth - margin) / setting.cells / grid) * grid
    const height = Math.floor((canvasHeight - margin) / setting.cells / grid) * grid
    for (let i = 0; i < setting.cells; i++) {
      for (let j = 0; j < setting.cells; j++) {
        const left = margin + i * width
        const top = margin + j * height
        const widthInPixel = width - margin
        const heightInPixel = height - margin
        const widthInInch = parseFloat((setting.getWidth() * widthInPixel / canvasWidth).toFixed(1))
        const heightInInch = parseFloat((setting.getHeight() * heightInPixel / canvasHeight).toFixed(1))
        
        const tag = "cell_" + collage.getUniqueId()
        const box = collage.createSimpleImageBox()
          .setTag(tag)
          .setGrid(setting.grid)
          .setBorder(setting.borderWidth, setting.borderColor)
          .setSizeInch(widthInInch, heightInInch)
          .addCellBoard(left, top, widthInPixel, heightInPixel)
        collage.addImageBox(tag, box)
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

export async function createWall(collage: Collage) {
  try {
    const setting = collage.getSetting()
    setting.savedObject = null

    collage.removeImageBoxs()
    collage.resetSavedCollage()
    collage.removeCanvasElement()

    const layout = new CanvasLayout(setting)
    const canvasWidth = layout.getCanvasWidthInPixel();
    const canvasHeight = canvasWidth * setting.getHeight() / setting.getWidth();
    collage.createCanvasElement(canvasWidth, canvasHeight)
    collage.createFabricCanvas(canvasWidth, canvasHeight)
    collage.drawGridLines()
    collage.drawCanvasSizeText();
    
    const grid = setting.grid
    const margin = Math.ceil(setting.margin / grid) * grid
    const width = Math.floor(0.4 * (canvasWidth - margin) / setting.cells / grid) * grid
    const height = Math.floor(0.4 * (canvasHeight - margin) / setting.cells / grid) * grid
    const marginLeft = Math.floor((canvasWidth - width * setting.cells) / 2 / grid) * margin
    const marginTop = Math.floor((canvasHeight - height * setting.cells) / 8 / grid) * margin
    for (let i = 0; i < setting.cells; i++) {
      for (let j = 0; j < setting.cells; j++) {
        const left = marginLeft + margin + i * width
        const top = marginTop + margin + j * height
        const widthInPixel = width - margin
        const heightInPixel = height - margin
        const widthInInch = parseFloat((setting.getWidth() * widthInPixel / canvasWidth).toFixed(1))
        const heightInInch = parseFloat((setting.getHeight() * heightInPixel / canvasHeight).toFixed(1))
        
        const tag = "cell_" + collage.getUniqueId()
        const box = collage.createSimpleImageBox()
          .setTag(tag)
          .setGrid(setting.grid)
          .setBorder(setting.borderWidth, setting.borderColor)
          .setSizeInch(widthInInch, heightInInch)
          .addCellBoard(left, top, widthInPixel, heightInPixel)
        collage.addImageBox(tag, box)
      }
    }
  }
  catch (err) {
    console.log(err)
  }
}

export async function saveTemplate(collage: Collage) {
  collage.setLoadingState(true)

  const canvasWidth = collage.getCanvasWidth()
  const canvasHeight = collage.getCanvasHeight()
  const twidth = 320
  const theight = twidth * (canvasHeight / canvasWidth)

  const virtualCanvas = await collage.createVirtualCanvas(twidth, theight)
  const dataUrl = virtualCanvas.toDataURL({
    format: 'jpeg',
    quality: 1.0
  });

  const s = collage.getSetting()
  const setting = Object.assign({}, s, {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight
  })

  const data = {setting: setting, images: collage.getTemplateInfo(), image: dataUrl};
  if (s.savedObject) {
    data['id'] = s.savedObject.id
  }
  console.log("Request Save Template:", data);

  const template = await collage.getApiSvc().saveTemplate(data)
  console.log('Saved Template', template)
  
  collage.removeVirtualCanvas(virtualCanvas)
  collage.setLoadingState(false)
  return template
}

export async function saveWall(collage: Collage) {
  collage.setLoadingState(true)

  const canvasWidth = collage.getCanvasWidth()
  const canvasHeight = collage.getCanvasHeight()
  const twidth = 320
  const theight = twidth * (canvasHeight / canvasWidth)

  const virtualCanvas = await collage.createVirtualCanvas(twidth, theight)
  const dataUrl = virtualCanvas.toDataURL({
    format: 'jpeg',
    quality: 1.0
  });

  const s = collage.getSetting()
  const setting = Object.assign({}, s, {
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight
  })

  const data = {setting: setting, images: collage.getTemplateInfo(), image: dataUrl};
  if (s.savedObject) {
    data['id'] = s.savedObject.id
  }
  console.log("Save Wall:", data);

  const wallFrames = await collage.getApiSvc().saveWallFrames(data)
  console.log('Wall', wallFrames)
  
  collage.removeVirtualCanvas(virtualCanvas)
  collage.setLoadingState(false)
  return wallFrames
}