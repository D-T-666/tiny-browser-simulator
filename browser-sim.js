class BrowserSim extends HTMLElement {
	constructor() {
		super()

		const header = document.createElement("div");
		header.classList.add("header");

		const tabs = document.createElement("div");
		tabs.classList.add("tabs");

		const url = document.createElement("div");
		url.classList.add("url");

		header.appendChild(tabs);
		header.appendChild(url);

		const pages = document.createElement("div");
		pages.classList.add("pages");
		pages.innerHTML = this.innerHTML;

		this.innerHTML = "";
		this.appendChild(header);
		this.appendChild(pages);

		const pagesByURL = {};
		for (const page of pages.children) {
			pagesByURL[page.getAttribute("url")] = page;
		}

		const visibleTabs = {};
		let currentPage = undefined;

		function showPage(u) {
			if (currentPage !== undefined) {
				pagesByURL[currentPage].classList.remove("current");
				visibleTabs[currentPage].classList.remove("current");
			}

			currentPage = u;
			pagesByURL[currentPage].classList.add("current");

			if (visibleTabs[pagesByURL[currentPage].getAttribute("url")] === undefined) {
				const tab = document.createElement("button");
				tab.classList.add("tab");
				tab.innerText = pagesByURL[currentPage].getAttribute("title");
				tab.addEventListener("click", (e) => showPage(u));
				tabs.appendChild(tab);
				visibleTabs[currentPage] = tab;
			}

			visibleTabs[currentPage].classList.add("current");

			url.innerText = `https://${pagesByURL[currentPage].getAttribute("url")}`;
		}

		for (const page of pages.children) {
			page.addEventListener("click", (e) => {
				if (e.target.tagName === "BROWSER-LINK") {
					e.preventDefault();
					
					showPage(e.target.getAttribute("to"));
				}
			})
		}

		showPage(pages.children[0].getAttribute("url"));
	}
}

class BrowserLink extends HTMLButtonElement {
	constructor() {
		super()
	}
}

class BrowserPage extends HTMLElement {
	constructor() {
		super()
	}
}


customElements.define("browser-sim", BrowserSim);
customElements.define("browser-link", BrowserLink);
customElements.define("browser-page", BrowserPage, { extends: "div" });

