import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../auth.service";
import { Collage } from '../collage/collage'

@Component({
  selector: "collage-template",
  templateUrl: "collage-template.component.html",
  styleUrls: ["collage-template.component.scss"],
})
export class CollageTemplateComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private collage: Collage
  ) {}

  async ngOnInit() {
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    this.collage.createTemplate({
      widthInch: 16,
      heightInch: 12,
      landscape: false,
      borderWidth: 0,
      borderColor: "rgb(0,0,0)"
    });
  }

  loggedIn() {
    return this.authSvc.loggedIn();
  }

  async onMenuItemClicked(e) {
    switch (e.target['id']) {
      case 'add_cell':
        this.collage.addCell()
        break

      case 'delete_cell':
        this.collage.deleteCell()
        break
    }
  }

  showTemplates() {
    this.router.navigate(["/template/preview"]);
  }

  handleDrop(e) {
    console.log(e, e.offsetX, e.offsetY)
    this.collage.onHandleDrop(e.offsetX, e.offsetY)
    return false;
  }

  async printCollage(way) {
    const userId = this.authSvc.getUserId()
    const url = await this.collage.printCollageImage(userId, way)    
    if (url) {
      const element = document.getElementById('print-button')
      element.setAttribute("href", url)
      element.click()
    }
  }
}
