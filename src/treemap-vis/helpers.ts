export let hasOwnProperty = Object.prototype.hasOwnProperty
export let indexOf = Array.prototype.indexOf;

let numberFormat: Intl.NumberFormat | undefined
let isSourceMap = /\.\w+\.map$/
let disabledPathPrefix = /^\(disabled\):/
