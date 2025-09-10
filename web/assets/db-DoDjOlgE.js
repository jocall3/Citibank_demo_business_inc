import{o as e}from"./idb-Dob3nYDb.js";/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/const s="devcore-mock-db",a=1,t="mock-collections",c=e(s,a,{upgrade(o){o.createObjectStore(t,{keyPath:"id"})}}),r=async o=>{await(await c).put(t,o)},d=async()=>(await c).getAll(t);export{d as g,r as s};
//# sourceMappingURL=db-DoDjOlgE.js.map
