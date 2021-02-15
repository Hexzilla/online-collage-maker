class CanvasContextMenu {
    menu: any
    menuOptions: any
    menuVisible: Boolean = false;
    addEventListener: Boolean = true;
    onMenuItemClicked: Function

    constructor(){

    }

    createMenu(x: any, y: any) {
      this.menu = document.querySelector(".menu");
      this.menuOptions = document.querySelectorAll(".menu-option");

      if (this.addEventListener) {
        this.addEventListener = false

        window.addEventListener("click", e => this.hideMenu());

        this.menuOptions.forEach(opt => {
          opt.addEventListener("click", e => this.onMenuOptionClickEvent(e))
        })
      }

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
      this.menu['style'].left = `${left}px`;
      this.menu['style'].top = `${top}px`;
      this.toggleMenu("show");
    };

    onMenuOptionClickEvent(e) {
        this.toggleMenu("hide")
        this.onMenuItemClicked(e)
    }
}

export default CanvasContextMenu
