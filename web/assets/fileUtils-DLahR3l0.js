// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/const s=n=>{let o="";const t=new Uint8Array(n),e=t.byteLength;for(let r=0;r<e;r++)o+=String.fromCharCode(t[r]);return window.btoa(o)},d=n=>new Promise((o,t)=>{const e=new FileReader;e.onloadend=()=>{o(s(e.result))},e.onerror=r=>t(r),e.readAsArrayBuffer(n)}),l=n=>d(n),i=n=>new Promise((o,t)=>{const e=new FileReader;e.onloadend=()=>{const r=s(e.result);o(`data:${n.type};base64,${r}`)},e.onerror=r=>t(r),e.readAsArrayBuffer(n)}),c=(n,o,t="text/plain")=>{const e=new Blob([n],{type:t}),r=URL.createObjectURL(e),a=document.createElement("a");a.href=r,a.download=o,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(r)},b=n=>{const o=Object.entries(n).map(([t,e])=>`${t}=${JSON.stringify(e)}`).join(`
`);c(o,".env","text/plain")},u=(n,o)=>{const t=JSON.stringify(n,null,2);c(t,o,"application/json")};export{d as a,i as b,b as c,c as d,u as e,l as f};
//# sourceMappingURL=fileUtils-DLahR3l0.js.map
