import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../auth.service";
import { Collage } from '../../collage/collage.service'
import { Setting } from "../../collage/setting";
import { createTemplate, saveTemplate } from "../template.builder";

@Component({
  selector: "template-maker",
  templateUrl: "template-maker.component.html",
  styleUrls: ["template-maker.component.scss"],
})
export class TemplateMakerComponent implements OnInit {
  public loading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private authSvc: AuthService,
    private router: Router,
    private collage: Collage,
    private setting: Setting
  ) {}

  async ngOnInit() {
    this.collage.onLoadingStateChanged = (state) => (this.loading = state);
    this.collage.onMenuItemClicked = (e) => this.onMenuItemClicked(e)

    document.addEventListener("contextmenu", (event) => event.preventDefault());

    if (!this.loggedIn()) {
      this.router.navigate(["/login"]);
      return false;
    }

    await this.create();
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

  async onControlActionEvent(e) {
    if (e.action == "create_template") {
      this.create()
    }
  }

  private async create() {
    this.collage.setSetting(this.setting.clone())
    await createTemplate(this.collage);
  }

  async onSaveTemplateButtonClick() {
    if (await saveTemplate(this.collage)) {
      this.toastr.success("Success");
    }
    else {
      this.toastr.success("Failed to save template");  
    }
  }

  onShowTemplatesButtonClick() {
    this.router.navigate(["/admin/templates"]);
  }

  handleDrop(e) {
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
