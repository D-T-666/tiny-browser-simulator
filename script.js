import "./browser-sim.js";

const examples = ["example-1"];

for (const exampleId of examples) {
	const html = document.getElementById(exampleId).outerHTML;
	document.getElementById(exampleId+"-source").innerText = html;
}
