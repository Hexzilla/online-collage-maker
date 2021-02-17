import { Injectable } from "@angular/core";
import perfectLayout from "perfect-layout";
import { Setting } from "./setting"

export class CanvasLayout {
  private setting: Setting;
  private containerWidth: number = 0;

  constructor(setting: Setting, containerWidth) {
    this.setting = setting
    this.containerWidth = containerWidth
  }

  getContainerWidth() {
    return this.containerWidth
  }

  getSetting() {
    return this.setting
  }

  calculateWidth() {
    if (this.setting.landscape) {
      return (this.setting.widthInch * this.getContainerWidth()) / this.setting.heightInch;
    } else {
      return this.getContainerWidth();
    }
  }

  calculateHeight() {
    if (this.setting.landscape) {
      return this.getContainerWidth();
    } else {
      return (this.setting.heightInch * this.getContainerWidth()) / this.setting.widthInch;
    }
  }

  getCanvasLayout(images) {
    const widthInPixels = this.calculateWidth();
    const heightInPixels = this.calculateHeight();

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

  getLayoutItems(images, perfectRows) {
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
}
