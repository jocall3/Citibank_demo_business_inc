// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import{r,j as e}from"./react-CIdJ77ke.js";import{aA as u,aB as h,L as c}from"./index-CIRHoGv6.js";import"./@braintree-DzxiOROe.js";import"./react-dom-R9L8nDNe.js";import"./scheduler-CoSDG3-6.js";import"./@google-dIZ1hAme.js";import"./idb-Dob3nYDb.js";import"./marked-BrGMJkBT.js";import"./mermaid-BKUgZdUC.js";import"./dayjs-CeEF-NGT.js";import"./d3-transition-CiCB8KJE.js";import"./d3-timer-DdKHrDhs.js";import"./d3-dispatch-kxCwF96_.js";import"./d3-interpolate-CtIaNujU.js";import"./d3-color-amxIadob.js";import"./d3-selection-C52G7wmG.js";import"./d3-ease-DRPgKoYJ.js";import"./d3-zoom-BYoC3mS3.js";import"./dompurify-J5RlrwSC.js";import"./dagre-d3-es-CTpFWynZ.js";import"./lodash-es-Dt6r0yiR.js";import"./d3-shape-CX8xTzfR.js";import"./d3-path-CimkQT29.js";import"./d3-fetch-BOsq7VnW.js";import"./khroma-DUX6PT6k.js";import"./uuid-DhYbOkY1.js";import"./d3-scale-DRZz3QW5.js";import"./internmap-BkD7Hj8s.js";import"./d3-array-DGRYoJHh.js";import"./d3-format-CzD4bSOQ.js";import"./d3-time-format-CUNN4Ell.js";import"./d3-time-6cSPyVSY.js";import"./d3-axis-DSWTncID.js";import"./elkjs-oKFFZvz7.js";import"./cytoscape-DtBltrT8.js";import"./cytoscape-cose-bilkent-Cgr1thlj.js";import"./cose-base-CwCxnKwh.js";import"./layout-base-CMXQqlmj.js";import"./d3-sankey-DgqkLiUE.js";import"./d3-scale-chromatic-B-NsZVaP.js";import"./ts-dedent-DrFu-skq.js";import"./stylis-D5iaQeiq.js";import"./mdast-util-from-markdown-CLAsVoWb.js";import"./micromark-CTBPIv-_.js";import"./micromark-util-combine-extensions-Bka6Sc1c.js";import"./micromark-util-chunked-DrRIdSP-.js";import"./micromark-factory-space-x2vfxbz5.js";import"./micromark-util-character-Bcm1tP9o.js";import"./micromark-core-commonmark-AH8VCgT7.js";import"./micromark-util-classify-character-Cq7Fg3xE.js";import"./micromark-util-resolve-all-PQCKh0dx.js";import"./decode-named-character-reference-C3-224fz.js";import"./micromark-util-subtokenize-QwsxNXk2.js";import"./micromark-factory-destination-CypD_wgM.js";import"./micromark-factory-label-CRHH4ZHP.js";import"./micromark-factory-title-B7kCBvC9.js";import"./micromark-factory-whitespace-B322EA6O.js";import"./micromark-util-normalize-identifier-C9ANKk3v.js";import"./micromark-util-html-tag-name-DbKNfynz.js";import"./micromark-util-decode-numeric-character-reference-DRnCnno4.js";import"./micromark-util-decode-string-DJl8Y_PO.js";import"./unist-util-stringify-position-Ch_qCilz.js";import"./mdast-util-to-string-C_aolqmU.js";import"./jszip-CFFhfFtd.js";import"./octokit-B6bKu3NB.js";import"./@octokit-MBEWYTsi.js";import"./bottleneck-D_vuF9V7.js";import"./universal-user-agent-CLgqIJsR.js";import"./before-after-hook-y8XtM9xW.js";import"./fast-content-type-parse-3SwieiST.js";const f=`class DataProcessor {
    process(data) {
        // Long method with multiple responsibilities
        if (data.type === 'A') {
            const results = [];
            for (let i = 0; i < data.items.length; i++) {
                // complex logic
                const item = data.items[i];
                if(item.value > 100) {
                   results.push({ ...item, status: 'processed' });
                }
            }
            return results;
        } else {
            // Duplicated logic
            const results = [];
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                 if(item.value > 100) {
                   results.push({ ...item, status: 'processed_special' });
                }
            }
            return results;
        }
    }
}`,Te=()=>{const[s,n]=r.useState(f),[i,a]=r.useState([]),[o,l]=r.useState(!1),[p,m]=r.useState(""),d=r.useCallback(async()=>{if(!s.trim()){m("Please provide code to scan.");return}l(!0),m(""),a([]);try{const t=await u(s);a(t)}catch(t){m(t instanceof Error?t.message:"An unknown error occurred.")}finally{l(!1)}},[s]);return e.jsxs("div",{className:"h-full flex flex-col p-4 sm:p-6 lg:p-8 text-text-primary",children:[e.jsxs("header",{className:"mb-6",children:[e.jsxs("h1",{className:"text-3xl font-bold flex items-center",children:[e.jsx(h,{}),e.jsx("span",{className:"ml-3",children:"Tech Debt Sonar"})]}),e.jsx("p",{className:"text-text-secondary mt-1",children:"Scan code to find code smells and areas with high complexity."})]}),e.jsxs("div",{className:"flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{className:"text-sm font-medium mb-2",children:"Code to Analyze"}),e.jsx("textarea",{value:s,onChange:t=>n(t.target.value),className:"flex-grow p-2 bg-surface border rounded font-mono text-xs"}),e.jsx("button",{onClick:d,disabled:o,className:"btn-primary w-full mt-4 py-3",children:o?e.jsx(c,{}):"Scan for Code Smells"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{className:"text-sm font-medium mb-2",children:"Detected Smells"}),e.jsxs("div",{className:"flex-grow p-2 bg-background border rounded overflow-auto",children:[o&&e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx(c,{})}),p&&e.jsx("p",{className:"text-red-500 p-4",children:p}),!o&&i.length===0&&e.jsx("p",{className:"text-text-secondary text-center pt-8",children:"No smells detected, or scan not run."}),i.length>0&&e.jsx("div",{className:"space-y-3",children:i.map((t,x)=>e.jsxs("div",{className:"p-3 bg-surface border border-border rounded-lg",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h4",{className:"font-bold text-primary",children:t.smell}),e.jsxs("span",{className:"text-xs font-mono bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded",children:["Line: ",t.line]})]}),e.jsx("p",{className:"text-sm mt-1",children:t.explanation})]},x))})]})]})]})]})};export{Te as TechDebtSonar};
//# sourceMappingURL=TechDebtSonar-CdXhL6Nf.js.map
