import type JQueryStatic from 'jquery'

export interface JqTools {
  cd: number
  jsonp(url: string, callbackFunc: string, data?: object): void
  arrayQueue<T>(arr: T[], turn?: boolean): T[]
  getRandom(num: number, type?: 'number' | 'word' | 'hybrid'): string
  countDown(time: number, Func: (cd: number) => void): ReturnType<typeof setInterval>
  deepCopy<T>(oldValue: T): T
  groupBy(arr: object[], groupby: string, res: string): object[]
  jsonArrayToArray(js: object[], ...keys: string[]): any[][]
  getCurDate(split?: string, start?: number, end?: number): string
  mergeArray<T>(fir: T[], sec: T[], newArray?: boolean): T[]
  arrayHasElement(obj: any[] | object, arr: any[]): any[]
  jsonAssignment(a: object, b: object): object | false
  arrayInputJsonArray(j: object[], a: any[], p: string): object[] | false
  /** @deprecated use arrayInputJsonArray */
  arrayInputJson(j: object[], a: any[], p: string): object[] | false
  extractArrayFromJsonArray(j: object[], ...props: string[]): any[] | object[]
  /** @deprecated use extractArrayFromJsonArray */
  extractArrayFromJson(j: object[], ...props: string[]): any[] | object[]
  jsonArrayReplace(arr: object[], prop: string, oldV: any, newV: any): object[]
  findIndex(obj: any[] | object, val: any, condition?: string): number | string | Array<number | string> | null
  findString(Str: string, val: string): boolean
  findIndexWithCallback(obj: any[], callback: (this: any[], curVal: any, index: number) => void): any[]
  jsonStringJoin(obj: object, arr: string[], sep: string): string
  AsciiSort<T>(obj: T[], attribute?: string): T[]
  money(m: number | string): string | false
  _checkOption(parameter: object, baseOption: object): boolean
}

declare global {
  interface JQuery {
    formTojson(newObj?: object, join?: boolean): object
    setCurDate(): void
    checkSqlInjection(): boolean
    checkDate(): boolean
    nextElement(Func: (t: JQuery, i: number) => void): void
    RegNumber(num?: number): boolean
    RegPhone(): boolean
    RegId(): boolean
    hasEmpty(): boolean
    dataToInput(obj: any[] | object): void
  }

  interface JQueryStatic {
    tools: JqTools
  }
}

declare const $: JQueryStatic
export default $
