var d=`
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
`,o=class extends HTMLElement{constructor(){super()}connectedCallback(){let e=this.attachShadow({mode:"closed"}),t=new CSSStyleSheet;t.replaceSync(d),console.log(t),e.adoptedStyleSheets=[t],this.tabs=document.createElement("div"),this.tabs.classList.add("tabs"),this.urlBar=document.createElement("div"),this.urlBar.classList.add("url");let i=document.createElement("div");i.classList.add("header"),i.append(this.tabs,this.urlBar),this.pages=document.createElement("div"),this.pages.classList.add("pages"),this.pages.innerHTML=this.innerHTML,this.innerHTML="";let s=document.createElement("div");s.classList.add("browser-sim-container"),s.append(i,this.pages),e.append(s),this.pagesByURL={};for(let r of this.pages.children)this.pagesByURL[r.getAttribute("url")]=r;console.log(this.pagesByURL),this.visibleTabs={},this.currentPageUrl=void 0;let a=!0;for(let r of this.pages.children)r.getAttribute("visible")!==null&&(this.createTab(r.getAttribute("url")),a&&(this.showPage(r.getAttribute("url")),a=!1))}showPage(e){this.currentPageUrl!==void 0&&(this.pagesByURL[this.currentPageUrl].classList.remove("current"),this.visibleTabs[this.currentPageUrl]&&this.visibleTabs[this.currentPageUrl].classList.remove("current")),this.pagesByURL[e].classList.add("current"),this.visibleTabs[e]===void 0&&this.createTab(e),this.visibleTabs[e].classList.add("current"),this.urlBar.innerText=`https://${e}`,this.currentPageUrl=e}createTab(e){let t=document.createElement("span");t.classList.add("tab");let i=document.createElement("button");if(i.innerText=this.pagesByURL[e].getAttribute("title"),i.addEventListener("click",s=>this.showPage(e)),t.appendChild(i),this.pagesByURL[e].getAttribute("nonclosable")===null){let s=document.createElement("button");s.innerHTML="&#10005;",s.addEventListener("click",a=>{if(this.visibleTabs[e].remove(),delete this.visibleTabs[e],this.currentPageUrl===e&&(this.pagesByURL[e].classList.remove("current"),this.currentPageUrl=void 0,this.urlBar.innerText="",Object.keys(this.visibleTabs).length>0)){let r=Object.keys(this.visibleTabs)[0];this.showPage(r)}}),t.appendChild(s)}this.tabs.appendChild(t),this.visibleTabs[e]=t}},l=class extends HTMLElement{constructor(){super(),this.addEventListener("click",this.click)}connectedCallback(){let e=this.getAttribute("browser");if(e!==null)this.targetBrowser=document.getElementById(e);else{let t=this;for(;t.parentElement;)if(t=t.parentElement,t.tagName==="BROWSER-SIM"){this.targetBrowser=t;break}}}click(e){this.targetBrowser.showPage(this.getAttribute("url")),this.targetBrowser.scrollIntoView({block:"nearest",behavior:"smooth"})}},c=class extends HTMLElement{constructor(){super()}};customElements.define("browser-sim",o);customElements.define("browser-link",l);customElements.define("browser-page",c);var b=["example-1"];for(let n of b){let e=document.getElementById(n).outerHTML;document.getElementById(n+"-source").innerText=e}
