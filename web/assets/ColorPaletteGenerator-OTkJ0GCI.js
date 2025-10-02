// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import{r as c,j as e}from"./react-CIdJ77ke.js";import{Z as C}from"./react-colorful-vLUrq4A0.js";import{aj as v,S as w,L as g,J as u}from"./index-CIRHoGv6.js";import{d as f}from"./fileUtils-DLahR3l0.js";import"./db-DoDjOlgE.js";import"./accessibilityService-CxnTg-sn.js";import"./workspaceConnectorService-DpOCHZ2y.js";import"./@braintree-DzxiOROe.js";import"./react-dom-R9L8nDNe.js";import"./scheduler-CoSDG3-6.js";import"./@google-dIZ1hAme.js";import"./idb-Dob3nYDb.js";import"./marked-BrGMJkBT.js";import"./mermaid-BKUgZdUC.js";import"./dayjs-CeEF-NGT.js";import"./d3-transition-CiCB8KJE.js";import"./d3-timer-DdKHrDhs.js";import"./d3-dispatch-kxCwF96_.js";import"./d3-interpolate-CtIaNujU.js";import"./d3-color-amxIadob.js";import"./d3-selection-C52G7wmG.js";import"./d3-ease-DRPgKoYJ.js";import"./d3-zoom-BYoC3mS3.js";import"./dompurify-J5RlrwSC.js";import"./dagre-d3-es-CTpFWynZ.js";import"./lodash-es-Dt6r0yiR.js";import"./d3-shape-CX8xTzfR.js";import"./d3-path-CimkQT29.js";import"./d3-fetch-BOsq7VnW.js";import"./khroma-DUX6PT6k.js";import"./uuid-DhYbOkY1.js";import"./d3-scale-DRZz3QW5.js";import"./internmap-BkD7Hj8s.js";import"./d3-array-DGRYoJHh.js";import"./d3-format-CzD4bSOQ.js";import"./d3-time-format-CUNN4Ell.js";import"./d3-time-6cSPyVSY.js";import"./d3-axis-DSWTncID.js";import"./elkjs-oKFFZvz7.js";import"./cytoscape-DtBltrT8.js";import"./cytoscape-cose-bilkent-Cgr1thlj.js";import"./cose-base-CwCxnKwh.js";import"./layout-base-CMXQqlmj.js";import"./d3-sankey-DgqkLiUE.js";import"./d3-scale-chromatic-B-NsZVaP.js";import"./ts-dedent-DrFu-skq.js";import"./stylis-D5iaQeiq.js";import"./mdast-util-from-markdown-CLAsVoWb.js";import"./micromark-CTBPIv-_.js";import"./micromark-util-combine-extensions-Bka6Sc1c.js";import"./micromark-util-chunked-DrRIdSP-.js";import"./micromark-factory-space-x2vfxbz5.js";import"./micromark-util-character-Bcm1tP9o.js";import"./micromark-core-commonmark-AH8VCgT7.js";import"./micromark-util-classify-character-Cq7Fg3xE.js";import"./micromark-util-resolve-all-PQCKh0dx.js";import"./decode-named-character-reference-C3-224fz.js";import"./micromark-util-subtokenize-QwsxNXk2.js";import"./micromark-factory-destination-CypD_wgM.js";import"./micromark-factory-label-CRHH4ZHP.js";import"./micromark-factory-title-B7kCBvC9.js";import"./micromark-factory-whitespace-B322EA6O.js";import"./micromark-util-normalize-identifier-C9ANKk3v.js";import"./micromark-util-html-tag-name-DbKNfynz.js";import"./micromark-util-decode-numeric-character-reference-DRnCnno4.js";import"./micromark-util-decode-string-DJl8Y_PO.js";import"./unist-util-stringify-position-Ch_qCilz.js";import"./mdast-util-to-string-C_aolqmU.js";import"./jszip-CFFhfFtd.js";import"./octokit-B6bKu3NB.js";import"./@octokit-MBEWYTsi.js";import"./bottleneck-D_vuF9V7.js";import"./universal-user-agent-CLgqIJsR.js";import"./before-after-hook-y8XtM9xW.js";import"./fast-content-type-parse-3SwieiST.js";import"./axe-core-NFfJ1iTt.js";const N=({palette:i,colors:s,setColors:l})=>{const n=({label:r,value:o,onChange:p})=>e.jsxs("div",{className:"flex items-center justify-between text-sm",children:[e.jsx("label",{className:"text-text-primary",children:r}),e.jsx("div",{className:"flex items-center gap-2",children:i.map(a=>e.jsx("button",{onClick:()=>p(a),className:`w-5 h-5 rounded-full border border-gray-300 ${o===a?"ring-2 ring-primary ring-offset-1":""}`,style:{backgroundColor:a},title:a},a))})]});return e.jsxs("div",{className:"bg-surface p-4 rounded-lg border border-border w-full max-w-sm",children:[e.jsx("h3",{className:"text-lg font-bold mb-4 text-text-primary",children:"Live Preview"}),e.jsxs("div",{className:"p-8 rounded-xl mb-4",style:{backgroundColor:s.cardBg},children:[e.jsx("div",{className:"px-4 py-1 rounded-full text-center text-sm inline-block",style:{backgroundColor:s.pillBg,color:s.pillText},children:"New Feature"}),e.jsx("div",{className:"mt-8 text-center",children:e.jsx("button",{className:"px-6 py-2 rounded-lg font-bold",style:{backgroundColor:s.buttonBg,color:s.cardBg},children:"Get Started"})})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(n,{label:"Card Background",value:s.cardBg,onChange:r=>l(o=>({...o,cardBg:r}))}),e.jsx(n,{label:"Pill Background",value:s.pillBg,onChange:r=>l(o=>({...o,pillBg:r}))}),e.jsx(n,{label:"Pill Text",value:s.pillText,onChange:r=>l(o=>({...o,pillText:r}))}),e.jsx(n,{label:"Button Background",value:s.buttonBg,onChange:r=>l(o=>({...o,buttonBg:r}))})]})]})},Oe=()=>{const[i,s]=c.useState("#0047AB"),[l,n]=c.useState(["#F0F2F5","#CCD3E8","#99AADD","#6688D1","#3366CC","#0047AB"]),[r,o]=c.useState(!1),[p,a]=c.useState(""),[m,b]=c.useState({cardBg:"#F0F2F5",pillBg:"#CCD3E8",pillText:"#0047AB",buttonBg:"#0047AB"}),h=c.useCallback(async()=>{o(!0),a("");try{const t=await v(i);n(t.colors),b({cardBg:t.colors[0],pillBg:t.colors[2],pillText:t.colors[5],buttonBg:t.colors[5]})}catch(t){const d=t instanceof Error?t.message:"An unknown error occurred.";a(`Failed to generate palette: ${d}`)}finally{o(!1)}},[i]),j=()=>{const t=`:root {
${l.map((d,x)=>`  --color-palette-${x+1}: ${d};`).join(`
`)}
}`;f(t,"palette.css","text/css")},y=()=>{const t=`
<div class="card">
  <div class="pill">New Feature</div>
  <button class="button">Get Started</button>
</div>
        `,d=`
.card {
  background-color: ${m.cardBg};
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}
.pill {
  background-color: ${m.pillBg};
  color: ${m.pillText};
  display: inline-block;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  text-align: center;
  font-size: 0.875rem;
}
.button {
  margin-top: 2rem;
  background-color: ${m.buttonBg};
  color: ${m.cardBg};
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
        `,x=`<!-- HTML -->
${t}

<!-- CSS -->
<style>
${d}
</style>`;f(x,"preview-card.html","text/html")};return e.jsxs("div",{className:"h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary",children:[e.jsxs("header",{className:"mb-6 text-center",children:[e.jsxs("h1",{className:"text-3xl font-bold flex items-center justify-center",children:[e.jsx(w,{}),e.jsx("span",{className:"ml-3",children:"AI Color Palette Generator"})]}),e.jsx("p",{className:"text-text-secondary mt-1",children:"Pick a base color, let Gemini design a palette, and preview it on a UI card."})]}),e.jsxs("div",{className:"flex-grow flex flex-col lg:flex-row items-center justify-center gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(C,{color:i,onChange:s,className:"!w-64 !h-64"}),e.jsx("div",{className:"p-2 bg-surface rounded-md font-mono text-lg border border-border",style:{color:i},children:i}),e.jsx("button",{onClick:h,disabled:r,className:"btn-primary w-full flex items-center justify-center px-6 py-3",children:r?e.jsx(g,{}):"Generate Palette"}),p&&e.jsx("p",{className:"text-red-500 text-sm mt-2",children:p})]}),e.jsxs("div",{className:"flex flex-col gap-2 w-full max-w-sm",children:[e.jsx("label",{className:"text-sm font-medium text-text-secondary mb-2",children:"Generated Palette:"}),r?e.jsx("div",{className:"flex items-center justify-center h-48",children:e.jsx(g,{})}):l.map(t=>e.jsxs("div",{className:"group flex items-center justify-between p-4 rounded-md shadow-sm border border-border",style:{backgroundColor:t},children:[e.jsx("span",{className:"font-mono font-bold text-black/70 mix-blend-overlay",children:t}),e.jsx("button",{onClick:()=>navigator.clipboard.writeText(t),className:"opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 hover:bg-white/50 px-3 py-1 rounded text-xs text-black font-semibold backdrop-blur-sm",children:"Copy"})]},t)),e.jsxs("div",{className:"flex gap-2 mt-2",children:[e.jsxs("button",{onClick:j,className:"flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-gray-100 border border-border rounded-md hover:bg-gray-200",children:[e.jsx(u,{className:"w-4 h-4"})," Download Colors"]}),e.jsxs("button",{onClick:y,className:"flex-1 flex items-center justify-center gap-2 text-sm py-2 bg-gray-100 border border-border rounded-md hover:bg-gray-200",children:[e.jsx(u,{className:"w-4 h-4"})," Download Card"]})]})]}),!r&&e.jsx(N,{palette:l,colors:m,setColors:b})]})]})};export{Oe as ColorPaletteGenerator};
//# sourceMappingURL=ColorPaletteGenerator-OTkJ0GCI.js.map
