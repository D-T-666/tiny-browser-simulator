// browser-sim.js
var BrowserSim = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.tabs = document.createElement("div");
    this.tabs.classList.add("tabs");
    this.urlBar = document.createElement("div");
    this.urlBar.classList.add("url");
    const header = document.createElement("div");
    header.classList.add("header");
    header.append(this.tabs, this.urlBar);
    this.pages = document.createElement("div");
    this.pages.classList.add("pages");
    this.pages.innerHTML = this.innerHTML;
    this.innerHTML = "";
    this.append(header, this.pages);
    this.pagesByURL = {};
    for (const page of this.pages.children) {
      this.pagesByURL[page.getAttribute("url")] = page;
    }
    console.log(this.pagesByURL);
    this.visibleTabs = {};
    this.currentPageUrl = void 0;
    let blank = true;
    for (const child of this.pages.children) {
      if (child.getAttribute("visible") !== null) {
        this.createTab(child.getAttribute("url"));
        if (blank) {
          this.showPage(child.getAttribute("url"));
          blank = false;
        }
      }
    }
  }
  showPage(u) {
    if (this.currentPageUrl !== void 0) {
      this.pagesByURL[this.currentPageUrl].classList.remove("current");
      if (this.visibleTabs[this.currentPageUrl]) {
        this.visibleTabs[this.currentPageUrl].classList.remove("current");
      }
    }
    this.pagesByURL[u].classList.add("current");
    if (this.visibleTabs[u] === void 0) {
      this.createTab(u);
    }
    this.visibleTabs[u].classList.add("current");
    this.urlBar.innerText = `https://${u}`;
    this.currentPageUrl = u;
  }
  createTab(u) {
    const tab = document.createElement("span");
    tab.classList.add("tab");
    const open = document.createElement("button");
    open.innerText = this.pagesByURL[u].getAttribute("title");
    open.addEventListener("click", (e) => this.showPage(u));
    tab.appendChild(open);
    if (this.pagesByURL[u].getAttribute("nonclosable") === null) {
      const close = document.createElement("button");
      close.innerHTML = "&#10005;";
      close.addEventListener("click", (e) => {
        this.visibleTabs[u].remove();
        delete this.visibleTabs[u];
        if (this.currentPageUrl !== u) return;
        this.pagesByURL[u].classList.remove("current");
        this.currentPageUrl = void 0;
        this.urlBar.innerText = "";
        if (Object.keys(this.visibleTabs).length > 0) {
          const url = Object.keys(this.visibleTabs)[0];
          this.showPage(url);
        }
      });
      tab.appendChild(close);
    }
    this.tabs.appendChild(tab);
    this.visibleTabs[u] = tab;
  }
};
var BrowserLink = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.click);
  }
  connectedCallback() {
    const targetBrowserId = this.getAttribute("browser");
    if (targetBrowserId !== null) {
      this.targetBrowser = document.getElementById(targetBrowserId);
    } else {
      let parent = this;
      while (parent.parentElement) {
        parent = parent.parentElement;
        if (parent.tagName === "BROWSER-SIM") {
          this.targetBrowser = parent;
          break;
        }
      }
    }
  }
  click(event) {
    this.targetBrowser.showPage(this.getAttribute("to"));
    this.targetBrowser.scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }
};
var BrowserPage = class extends HTMLElement {
  constructor() {
    super();
  }
};
customElements.define("browser-sim", BrowserSim);
customElements.define("browser-link", BrowserLink);
customElements.define("browser-page", BrowserPage);

// script.js
var examples = ["example-1"];
for (const exampleId of examples) {
  const html = document.getElementById(exampleId).outerHTML;
  document.getElementById(exampleId + "-source").innerText = html;
}
