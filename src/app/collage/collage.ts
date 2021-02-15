import { Injectable } from "@angular/core";
import { ApiService } from "../api/api";
import perfectLayout from "perfect-layout";
import Board from "./board";

@Injectable({
  providedIn: "root",
})
export class Collage {
  canvas: any;
  public board: Board;
  loading: boolean = false;

  onLoadingStateChanged: Function;
  openDialog: Function;

  width: number = 8;
  height: number = 12;
  landscape: boolean = false;
  borderWidth: number = 0;
  borderColor: string;

  constructor(private api: ApiService) {}

  getContainerWidth() {
    return document.getElementById("canvas-container").offsetWidth;
  }

  calculateWidth() {
    if (this.landscape) {
      return (this.width * this.getContainerWidth()) / this.height;
    } else {
      return this.getContainerWidth();
    }
  }

  calculateHeight() {
    if (this.landscape) {
      return this.getContainerWidth();
    } else {
      return (this.height * this.getContainerWidth()) / this.width;
    }
  }

  async ngOnInit() {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    //this.setBoard()
  }

  setLoadingState(state) {
    this.loading = state;
    this.onLoadingStateChanged && this.onLoadingStateChanged(state);
  }

  async setBoard() {
    const container = document.getElementById("canvas-container");
    if (container.childNodes.length > 0) {
      container.removeChild(container.childNodes[0]);
    }

    this.setLoadingState(true);
    let data = await this.getData();
    if (data && data.images && data.images.length) {
      const images = this.shuffle(data.images);
      Promise.all(
        images.map(async (item) => {
          const img = new Image();
          img.src = item.src;
          await this.loadImage(img);
          return Object.assign(item, {
            image: img,
            ratio: img.width / img.height,
          });
        })
      )
        .then((images) => {
          console.log("load completed");
          this.setLoadingState(false);
          this.onImageLoaded(images);
        })
        .catch((err) => {
          this.setLoadingState(false);
        });
    } else {
      this.setLoadingState(false);
    }
  }

  loadImage = async (img) => {
    return new Promise((resolve, reject) => {
      img.onload = async () => {
        console.log("a image loaded");
        resolve(true);
      };
    });
  };

  onImageLoaded(images) {
    const widthInPixels = this.calculateWidth();
    const heightInPixels = this.calculateHeight();

    // get perfect layouts.
    const perfectRows = this.getPerfectLayout(images);
    const layoutItems = this.drawImage(images, perfectRows);
    const canvasHeight =
      this.borderWidth +
      layoutItems.reduce((accumulator, item) => {
        return Math.max(accumulator, item.top + item.height);
      }, 0);

    const container = document.getElementById("canvas-container");
    var canvas = document.createElement("canvas");
    canvas.id = "main-canvas";
    canvas.width = widthInPixels;
    canvas.height = canvasHeight;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    container.appendChild(canvas);

    this.board = new Board("main-canvas", widthInPixels, canvasHeight);
    this.board.onEditImage = (url) => this.onEditImage(url);
    this.board.setImages(layoutItems, this.borderWidth, this.borderColor);
  }

  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getPerfectLayout(images) {
    const widthInPixels = this.calculateWidth();
    const heightInPixels = this.calculateHeight();

    let minDelta = 0;
    let perfectLayouts = null;

    let minHeight = 1,
      maxHeight = heightInPixels;
    while (maxHeight - minHeight > 1) {
      let curHeight = minHeight + (maxHeight - minHeight) / 2;
      //console.log('GetPerfectLayout-A', minHeight, maxHeight, curHeight)

      let layouts = this.calculateLayout(
        images,
        widthInPixels,
        curHeight,
        this.borderWidth
      );
      const ih = this.getTotalHeight(layouts);
      const delta = ih - heightInPixels;
      //console.log('GetPerfectLayout-B', curHeight.toFixed(1), delta, ih, "\t", heightInPixels, layouts)

      if (delta < 100) {
        if (minDelta == 0 || minDelta > Math.abs(delta)) {
          minDelta = Math.abs(delta);
          perfectLayouts = layouts;
        }
      }

      if (delta == 0) {
        return layouts;
      } else if (delta > 0) {
        maxHeight = curHeight;
      } else {
        minHeight = curHeight;
      }
    }
    //console.log('GetPerfectLayout-C', minDelta)
    return perfectLayouts;
  }

  calculateLayout(images, width, height, margin) {
    return perfectLayout(images, width - 2 * margin, height);
    /*return perfectLayout(images, width, height, {
          margin: margin
        })*/
  }

  getTotalHeight(layouts) {
    return layouts.reduce((accumulator, items) => {
      if (Array.isArray(items)) {
        const maxHeight = items.reduce(
          (height, item) => Math.max(item.height, height),
          0
        );
        return accumulator + maxHeight;
      } else {
        return Math.max(accumulator, items.height);
      }
    }, 0);
  }

  drawImage(images, perfectRows) {
    console.log("perfectRows", perfectRows);

    let top = 0;
    const layoutItems = perfectRows.reduce((accumulator, items, colIndex) => {
      const curTop = top;
      if (Array.isArray(items) && items.length > 0) {
        top += items[0].height;
      } else {
        top += items.height;
      }

      let left = 0;
      const updatedItems = items.map((item, rowIndex) => {
        const img = images.find((it) => it.data == item.data);
        const scale = item.height / img.image.height;

        const curLeft = left;
        left += img.image.width * scale;

        return Object.assign(
          {
            left: curLeft,
            top: curTop,
            col: colIndex,
            row: rowIndex,
            img: img.image,
            scale: scale,
          },
          item
        );
      });

      return accumulator.concat(updatedItems);
    }, []);

    return layoutItems;
  }

  onEditImage(url) {
    this.openDialog && this.openDialog(url)
  }

  generate(
    width: number,
    height: number,
    landscape: boolean,
    borderWidth: number,
    borderColor: string
  ) {
    //console.log('Generate Collage:', borderWidth, borderColor)
    if (!this.loading) {
      this.width = width;
      this.height = height;
      this.landscape = landscape;
      this.borderWidth = borderWidth;
      this.borderColor = borderColor;
      this.setBoard();
    }
  }

  saveTemplate() {
    if (!this.board) {
      return;
    }

    const result = {
      width: this.width,
      height: this.height,
      boardWidth: this.borderWidth,
      borderColor: this.borderColor,
      images: this.board.getCollageInfo(),
    };

    console.log("template:", result);
  }

  async getData() {
    let data = await this.api.getData();
    return data;
  }
}
