class CanvasContextMenu {
    menu: any
    menuOptions: any
    menuVisible: Boolean = false;
    onMenuItemClicked: Function

    constructor(){
      window.addEventListener("click", e => this.hideMenu());
    }

    createMenu(selector, x: any, y: any) {
      if (!this.menuOptions) {
        this.menuOptions = document.querySelectorAll(".menu-option");
        this.menuOptions.forEach(opt => {
          opt.addEventListener("click", e => this.onMenuOptionClickEvent(e))
        })
      }
      
      this.hideMenu();
      this.menu = document.querySelector(selector);
      this.setPosition(x, y);
    }

    hideMenu() {
        this.menuVisible && this.toggleMenu("hide");
    }

    toggleMenu(command) {
      this.menu['style'].display = command === "show" ? "block" : "none";
      this.menuVisible = !this.menuVisible;
    };

    setPosition(left, top) {
      if (this.menu) {
        this.menu['style'].left = `${left}px`;
        this.menu['style'].top = `${top}px`;
        this.toggleMenu("show");
      }
    };

    onMenuOptionClickEvent(e) {
        this.toggleMenu("hide")
        this.onMenuItemClicked(e)
    }
}

export default CanvasContextMenu
