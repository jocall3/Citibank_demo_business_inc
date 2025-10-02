// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

function t(r,n){const e=Number.parseInt(r,n);return e<9||e===11||e>13&&e<32||e>126&&e<160||e>55295&&e<57344||e>64975&&e<65008||(e&65535)===65535||(e&65535)===65534||e>1114111?"�":String.fromCharCode(e)}export{t as d};
//# sourceMappingURL=micromark-util-decode-numeric-character-reference-DRnCnno4.js.map
