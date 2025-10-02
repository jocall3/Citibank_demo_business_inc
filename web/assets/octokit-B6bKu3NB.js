// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import{O as a,r as n,p as o,a as u,b as s,t as i}from"./@octokit-MBEWYTsi.js";var d="0.0.0-development",c=a.plugin(n,o,u,s,i).defaults({userAgent:`octokit.js/${d}`,throttle:{onRateLimit:f,onSecondaryRateLimit:g}});function f(r,e,t){if(t.log.warn(`Request quota exhausted for request ${e.method} ${e.url}`),e.request.retryCount===0)return t.log.info(`Retrying after ${r} seconds!`),!0}function g(r,e,t){if(t.log.warn(`SecondaryRateLimit detected for request ${e.method} ${e.url}`),e.request.retryCount===0)return t.log.info(`Retrying after ${r} seconds!`),!0}export{c as O};
//# sourceMappingURL=octokit-B6bKu3NB.js.map
