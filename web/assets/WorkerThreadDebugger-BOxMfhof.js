// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import{r as t,j as e}from"./react-CIdJ77ke.js";import{a7 as j,a8 as y,L as f,J as g,M as b}from"./index-CIRHoGv6.js";import{d as w}from"./fileUtils-DLahR3l0.js";import"./db-DoDjOlgE.js";import"./accessibilityService-CxnTg-sn.js";import"./workspaceConnectorService-DpOCHZ2y.js";import"./@braintree-DzxiOROe.js";import"./react-dom-R9L8nDNe.js";import"./scheduler-CoSDG3-6.js";import"./@google-dIZ1hAme.js";import"./idb-Dob3nYDb.js";import"./marked-BrGMJkBT.js";import"./mermaid-BKUgZdUC.js";import"./dayjs-CeEF-NGT.js";import"./d3-transition-CiCB8KJE.js";import"./d3-timer-DdKHrDhs.js";import"./d3-dispatch-kxCwF96_.js";import"./d3-interpolate-CtIaNujU.js";import"./d3-color-amxIadob.js";import"./d3-selection-C52G7wmG.js";import"./d3-ease-DRPgKoYJ.js";import"./d3-zoom-BYoC3mS3.js";import"./dompurify-J5RlrwSC.js";import"./dagre-d3-es-CTpFWynZ.js";import"./lodash-es-Dt6r0yiR.js";import"./d3-shape-CX8xTzfR.js";import"./d3-path-CimkQT29.js";import"./d3-fetch-BOsq7VnW.js";import"./khroma-DUX6PT6k.js";import"./uuid-DhYbOkY1.js";import"./d3-scale-DRZz3QW5.js";import"./internmap-BkD7Hj8s.js";import"./d3-array-DGRYoJHh.js";import"./d3-format-CzD4bSOQ.js";import"./d3-time-format-CUNN4Ell.js";import"./d3-time-6cSPyVSY.js";import"./d3-axis-DSWTncID.js";import"./elkjs-oKFFZvz7.js";import"./cytoscape-DtBltrT8.js";import"./cytoscape-cose-bilkent-Cgr1thlj.js";import"./cose-base-CwCxnKwh.js";import"./layout-base-CMXQqlmj.js";import"./d3-sankey-DgqkLiUE.js";import"./d3-scale-chromatic-B-NsZVaP.js";import"./ts-dedent-DrFu-skq.js";import"./stylis-D5iaQeiq.js";import"./mdast-util-from-markdown-CLAsVoWb.js";import"./micromark-CTBPIv-_.js";import"./micromark-util-combine-extensions-Bka6Sc1c.js";import"./micromark-util-chunked-DrRIdSP-.js";import"./micromark-factory-space-x2vfxbz5.js";import"./micromark-util-character-Bcm1tP9o.js";import"./micromark-core-commonmark-AH8VCgT7.js";import"./micromark-util-classify-character-Cq7Fg3xE.js";import"./micromark-util-resolve-all-PQCKh0dx.js";import"./decode-named-character-reference-C3-224fz.js";import"./micromark-util-subtokenize-QwsxNXk2.js";import"./micromark-factory-destination-CypD_wgM.js";import"./micromark-factory-label-CRHH4ZHP.js";import"./micromark-factory-title-B7kCBvC9.js";import"./micromark-factory-whitespace-B322EA6O.js";import"./micromark-util-normalize-identifier-C9ANKk3v.js";import"./micromark-util-html-tag-name-DbKNfynz.js";import"./micromark-util-decode-numeric-character-reference-DRnCnno4.js";import"./micromark-util-decode-string-DJl8Y_PO.js";import"./unist-util-stringify-position-Ch_qCilz.js";import"./mdast-util-to-string-C_aolqmU.js";import"./jszip-CFFhfFtd.js";import"./octokit-B6bKu3NB.js";import"./@octokit-MBEWYTsi.js";import"./bottleneck-D_vuF9V7.js";import"./universal-user-agent-CLgqIJsR.js";import"./before-after-hook-y8XtM9xW.js";import"./fast-content-type-parse-3SwieiST.js";import"./axe-core-NFfJ1iTt.js";const k=`// main.js
const worker = new Worker('worker.js');

// This object is sent back and forth.
// A race condition can occur because both threads
// read the counter, increment it, and send it back.
// The final value depends on which thread's message
// is processed last.
const data = { counter: 0 };

worker.onmessage = function(e) {
  // Main thread reads and updates
  data.counter = e.data.counter;
  console.log('Main received:', data.counter);
  data.counter++;
  worker.postMessage(data);
};

// Start the process
console.log('Main starting with:', data.counter);
data.counter++;
worker.postMessage(data);


// worker.js
// onmessage = function(e) {
//   // Worker reads and updates
//   let receivedCounter = e.data.counter;
//   console.log('Worker received:', receivedCounter);
//   receivedCounter++;
//   postMessage({ counter: receivedCounter });
// }
`,He=({codeInput:o})=>{const[p,d]=t.useState(o||k),[s,x]=t.useState(""),[r,u]=t.useState(!1),[m,c]=t.useState(""),l=t.useCallback(async a=>{if(!a.trim()){c("Please paste some code to analyze.");return}u(!0),c(""),x("");try{const i=j(a);let n="";for await(const h of i)n+=h,x(n)}catch(i){const n=i instanceof Error?i.message:"An unknown error occurred.";c(`Failed to analyze code: ${n}`)}finally{u(!1)}},[]);return t.useEffect(()=>{o&&(d(o),l(o))},[o,l]),e.jsxs("div",{className:"h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary",children:[e.jsxs("header",{className:"mb-6",children:[e.jsxs("h1",{className:"text-3xl font-bold flex items-center",children:[e.jsx(y,{}),e.jsx("span",{className:"ml-3",children:"AI Concurrency Analyzer"})]}),e.jsx("p",{className:"text-text-secondary mt-1",children:"Analyze JavaScript code for potential Web Worker concurrency issues."})]}),e.jsxs("div",{className:"flex-grow flex flex-col gap-4 min-h-0",children:[e.jsxs("div",{className:"flex flex-col flex-1 min-h-0",children:[e.jsx("label",{htmlFor:"code-input",className:"text-sm font-medium text-text-secondary mb-2",children:"JavaScript Code"}),e.jsx("textarea",{id:"code-input",value:p,onChange:a=>d(a.target.value),placeholder:"Paste your worker-related JS code here...",className:"flex-grow p-4 bg-surface border border-border rounded-md resize-none font-mono text-sm"})]}),e.jsx("div",{className:"flex-shrink-0",children:e.jsx("button",{onClick:()=>l(p),disabled:r,className:"btn-primary w-full max-w-xs mx-auto flex items-center justify-center px-6 py-3",children:r?e.jsx(f,{}):"Analyze Code"})}),e.jsxs("div",{className:"flex flex-col flex-1 min-h-0",children:[e.jsxs("div",{className:"flex justify-between items-center mb-2",children:[e.jsx("label",{className:"text-sm font-medium text-text-secondary",children:"AI Analysis"}),s&&!r&&e.jsxs("button",{onClick:()=>w(s,"analysis.md","text/markdown"),className:"flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs rounded-md hover:bg-gray-200",children:[e.jsx(g,{className:"w-4 h-4"})," Download"]})]}),e.jsxs("div",{className:"flex-grow p-4 bg-background border border-border rounded-md overflow-y-auto",children:[r&&e.jsx("div",{className:"flex items-center justify-center h-full",children:e.jsx(f,{})}),m&&e.jsx("p",{className:"text-red-500",children:m}),s&&!r&&e.jsx(b,{content:s}),!r&&!s&&!m&&e.jsx("div",{className:"text-text-secondary h-full flex items-center justify-center",children:"Analysis will appear here."})]})]})]})]})};export{He as WorkerThreadDebugger};
//# sourceMappingURL=WorkerThreadDebugger-BOxMfhof.js.map
