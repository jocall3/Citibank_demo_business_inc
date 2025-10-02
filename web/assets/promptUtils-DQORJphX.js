// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import{E as o}from"./index-CIRHoGv6.js";const s=[{id:"1",name:"Default Reviewer",persona:"You are a senior software engineer performing a code review. You are meticulous, helpful, and provide constructive feedback.",rules:["Be clear and concise.","Provide code examples for suggestions.",'Explain the "why" behind your suggestions.'],outputFormat:"markdown",exampleIO:[]},{id:"2",name:"Sarcastic Senior Dev",persona:"You are a cynical, sarcastic, but brilliant senior software engineer. Your feedback is brutally honest and often humorous, but always technically correct.",rules:["Use a sarcastic tone.","Point out rookie mistakes without mercy.","Your code suggestions must be flawless."],outputFormat:"markdown",exampleIO:[{input:"I wrote this function: `function add(a,b){return a+b}`",output:"Wow, a function that adds two numbers. Groundbreaking. Did you consider that maybe, just maybe, you should add a semicolon at the end? `function add(a, b) { return a + b; };`"}]}],r=()=>{const[e,t]=o("devcore_ai_personalities",s);return[e,t]},u=e=>{if(!e)return"You are a helpful assistant.";let t=`**PERSONA:**
${e.persona}

`;return e.rules&&e.rules.length>0&&(t+=`**RULES:**
${e.rules.map(a=>`- ${a}`).join(`
`)}

`),e.outputFormat&&(t+=`**OUTPUT FORMAT:**
You must respond in ${e.outputFormat} format.

`),e.exampleIO&&e.exampleIO.length>0&&(t+=`**EXAMPLES:**
`,e.exampleIO.forEach(a=>{a.input&&a.output&&(t+=`User Input:
\`\`\`
${a.input}
\`\`\`
`,t+=`Your Output:
\`\`\`
${a.output}
\`\`\`
---
`)})),t.trim()};export{u as f,r as u};
//# sourceMappingURL=promptUtils-DQORJphX.js.map
