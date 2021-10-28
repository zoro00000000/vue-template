/* eslint-disable */
/**
 * global globalThis, self
 */

/**
 * 从Node.js中检测自由变量' global '
 */
const freeGlobal = typeof global === 'object' && global !== null && global.Object === Object && global

/**
 * 检测自由变量' globalThis '
 */
const freeGlobalThis = typeof globalThis === 'object' && globalThis !== null && globalThis.Object == Object && globalThis

/**
 * 检测自由变量' self '
 */
const freeSelf = typeof self === 'object' && self !== null && self.Object === Object && self

const root = freeGlobalThis || freeGlobal || freeSelf || Function('return this')

export default root
