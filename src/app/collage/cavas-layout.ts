import { Injectable } from "@angular/core";
import perfectLayout from "perfect-layout";
import { Setting } from "./setting"

export class CanvasLayout {
  private setting: Setting;

  constructor(setting: Setting) {
    this.setting = setting
  }

  private getCanvasContainerWidthInPixel() {
    return document.getElementById("canvas-container").offsetWidth;
  }

  getContainerWidth() {
    return this.getCanvasContainerWidthInPixel()
  }

  getSetting() {
    return this.setting
  }

  getCanvasWidthInPixel() {
    return this.getContainerWidth();
  }

  getPixelForInch() {
    return this.getContainerWidth() / this.setting.getWidth();
  }

  getCanvasHeightInPixel() {
    return (this.setting.getHeight() * this.getContainerWidth()) / this.setting.getWidth();
  }

  getCanvasLayout(images) {
    const widthInPixels = this.getCanvasWidthInPixel();
    const heightInPixels = this.getCanvasHeightInPixel();

    let minDelta = 0;
    let perfectLayouts = null;

    let minHeight = 1
    let maxHeight = heightInPixels

    while (maxHeight - minHeight > 1) {
      let curHeight = minHeight + (maxHeight - minHeight) / 2;

      let layouts = this.calculateLayout(
        images,
        widthInPixels,
        curHeight,
        this.setting.borderWidth
      );
      const ih = this.getMaxHeight(layouts);
      const delta = ih - heightInPixels;
      if (delta < 100) {
        if (minDelta == 0 || minDelta > Math.abs(delta)) {
          minDelta = Math.abs(delta);
          perfectLayouts = layouts;
        }
      }

      if (delta == 0) {
        return layouts;
      } 
      else if (delta > 0) {
        maxHeight = curHeight;
      } 
      else {
        minHeight = curHeight;
      }
    }

    return perfectLayouts;
  }

  calculateLayout(images, width, height, margin) {
    return perfectLayout(images, width - 2 * margin, height);
    /*return perfectLayout(images, width, height, {
          margin: margin
        })*/
  }

  getMaxHeight(layouts) {
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

  getLayoutItems(images, perfectRows, canvasWidth, borderSize) {
    let top = 0;
    const layoutItems = perfectRows.reduce((accumulator, items, colIndex) => {
      let delta = 0.0
      while (true) {
        const calcWidth = borderSize + items.reduce((accum, item) => {
          const img = images.find((it) => it.data == item.data);
          item.height += delta
          const scale = item.height / img.image.height;
          return accum + img.image.width * scale;
        }, 0);

        if (calcWidth >= canvasWidth) {
          //console.log('*Width', calcWidth, canvasWidth)
          break
        }
        delta = 0.001
      }

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

        let curLeft = left;
        let realWidth = img.image.width * scale
        left += realWidth;

        let offset = curLeft + realWidth - canvasWidth
        if (offset > 0) {
          curLeft -= offset
        }

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

  ceilPrecised(number, precision) {
    var power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }
}
