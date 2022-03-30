export default class Slider {
  constructor(ele, options) {
    this.DOM = {};
    this.DOM.slider = document.querySelector(ele);
    this.DOM.prevBtn = document.querySelector(".js-slider__prevButton");
    this.DOM.nextBtn = document.querySelector(".js-slider__nextButton");
    this.DOM.nav = document.querySelector(".js-slider__nav");
    this.loopId = false;
    this.page = 0;
    this.total;

    this.defaultOptions = {
      loop: true,
      nav: true,
      duration: 6000,
      delay: 2000,
    };
    this.options = Object.assign(this.defaultOptions, options);

    this._init();
  }

  _init() {
    if (!this.DOM.slider) {
      return false;
    }

    this.total = this.DOM.slider.childElementCount;

    // console.log(this.DOM.btn);
    if (this.DOM.prevBtn !== null) {
      this.DOM.prevBtn.addEventListener("click", this._prev.bind(this), { passive: true });
    }

    if (this.DOM.nextBtn !== null) {
      this.DOM.nextBtn.addEventListener("click", this._next.bind(this), { passive: true });
    }

    if (this.options.nav) {
      this._createNav();
    }

    window.onload = () => {
      this._setPage();
    };
  }

  _setPage() {
    this._stopLoop();
    this.DOM.slider.children.forEach((elem) => {
      elem.classList.remove("is-sliderActive");
      elem.classList.remove("is-sliderPrev");
      elem.classList.remove("is-sliderNext");
    });

    const prev = this.page < 1 ? this.total - 1 : this.page - 1;
    const next = this.page >= this.total - 1 ? 0 : this.page + 1;

    this.DOM.slider.children[this.page].classList.add("is-sliderActive");
    this.DOM.slider.children[prev].classList.add("is-sliderPrev");
    this.DOM.slider.children[next].classList.add("is-sliderNext");

    if (this.options.nav) {
      this.DOM.nav.children.forEach((elem) => {
        elem.children[0].classList.remove("is-sliderActive");
      });
      this.DOM.nav.children[this.page].children[0].classList.add("is-sliderActive");
    }

    if (this.options.loop) {
      setTimeout(() => {
        this._startLoop();
        this.options.delay = 0;
      }, this.options.delay);
    }
  }

  _startLoop() {
    this.loopId = setTimeout(() => {
      if (this.page === this.total - 1) {
        this.page = 0;
      } else {
        this.page++;
      }
      this._setPage();
    }, this.options.duration);
  }

  _stopLoop() {
    clearTimeout(this.loopId);
  }

  _changePage(e) {
    this.page = Number(e.currentTarget.getAttribute("data-id"));
    this._setPage();
  }

  _createNav() {
    for (let i = 0; i < this.total; i++) {
      // 要素の生成
      let listElem = document.createElement("li");
      let buttonElem = document.createElement("button");

      let spanElem = document.createElement("span");
      let buttonText = document.createTextNode(i + i);

      // 要素の設定
      listElem.classList.add("c-slider__navItem");

      buttonElem.setAttribute("type", "button");
      buttonElem.classList.add("c-button");
      buttonElem.classList.add("c-slider__navButton");
      buttonElem.setAttribute("data-id", i);
      buttonElem.addEventListener("click", this._changePage.bind(this), { passive: true });

      spanElem.classList.add("u-visuallyHidden");

      // 要素の挿入
      spanElem.appendChild(buttonText);
      buttonElem.appendChild(spanElem);
      listElem.appendChild(buttonElem);

      this.DOM.nav.appendChild(listElem);
    }
  }
}
