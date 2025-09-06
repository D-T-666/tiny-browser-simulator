import "./browser-sim.css";

const styles = `
div.browser-sim-container {
	&:has(.tab) .header {
		box-sizing: border-box;

		& .tabs {
			padding: 3px 3px 0 3px;

			& .tab {
				padding: 4px 10px;
				background: white;
				box-sizing: border-box;
				display: inline-block;
				border-radius: 4px 4px 0 0;
				position: relative;

				& button {
					background: none;
					border: none;
					padding: 0;

					& + & {
						margin-left: 6px;
						color: gray;

						&:hover {
							color: black;
						}
					}
				}

				&.current {
					background-color: #ddd;
				}

				&:not(.current) {
					&+&::before {
						content: "";
						display: block;
						position: absolute;
						width: 1px;
						height: 1.4rem;
						background-color: #ddd;
						left: 0;
						top: 4px;
					}

					&:hover {
						background-color: #eee;
					}
				}
			}
		}

		& .url {
			background-color: white;
			border: 3px solid #ddd;
			margin-bottom: 0;
			padding: 2px 0.5rem;
		}
	}

	&:has(.tab) .pages {
		aspect-ratio: 16 / 9;
	}

	&:not(:has(.tab)) .pages {
		&::before {
			display: block;
			content: "browser";
			color: gray;
			width: fit-content;
			margin: auto;
		}
	}

	& .pages {
		overflow-y: auto;

		& browser-page {
			padding: 10px;
			display: block;
			position: relative;
			box-sizing: border-box;

			&:not(.current) {
				display: none;
			}
		}
	}
}

browser-link {
	color: blue;
	cursor: pointer;
	text-decoration: underline;
}
`;

class BrowserSim extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		const shadow = this.attachShadow({ mode: "closed" });

		const sheet = new CSSStyleSheet();
		sheet.replaceSync(styles);
		console.log(sheet);
		shadow.adoptedStyleSheets = [sheet];

		/// Create static sub-elements

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

		const container = document.createElement("div");
		container.classList.add("browser-sim-container");
		container.append(header, this.pages);

		shadow.append(container);

		/// Create dynamic sub-elements

		this.pagesByURL = {};
		for (const page of this.pages.children) {
			this.pagesByURL[page.getAttribute("url")] = page;
		}

		console.log(this.pagesByURL)

		this.visibleTabs = {};
		this.currentPageUrl = undefined;

		let blank = true;
		for (const child of this.pages.children) {
			if (child.getAttribute("visible") !== null) {
				this.createTab(child.getAttribute("url"))
				if (blank) {
					this.showPage(child.getAttribute("url"))
					blank = false;
				}
			}
		}
	}

	showPage(u) {
		if (this.currentPageUrl !== undefined) {
			this.pagesByURL[this.currentPageUrl].classList.remove("current");
			if (this.visibleTabs[this.currentPageUrl]) {
				this.visibleTabs[this.currentPageUrl].classList.remove("current");
			}
		}

		this.pagesByURL[u].classList.add("current");

		if (this.visibleTabs[u] === undefined) {
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

				this.pagesByURL[u].classList.remove("current")
				this.currentPageUrl = undefined;
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
}

class BrowserLink extends HTMLElement {
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
		this.targetBrowser.showPage(this.getAttribute("url"))
		this.targetBrowser.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}
}

class BrowserPage extends HTMLElement {
	constructor() {
		super()
	}
}

customElements.define("browser-sim", BrowserSim);
customElements.define("browser-link", BrowserLink);
customElements.define("browser-page", BrowserPage);
