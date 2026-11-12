import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'

const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <form id="f">
    <input type="text" name="name" value="siyuan" />
    <input type="text" name="password" value="123" />
  </form>
  <input type="date" id="start" value="2024-01-01" />
  <input type="date" id="end" value="2024-01-10" />
  <input type="date" id="endBad" value="2023-01-01" />
  <input type="text" id="num" value="5.294" />
  <input type="text" id="phoneOk" value="13800138000" />
  <input type="text" id="phoneBad" value="138001" />
  <input type="text" id="idOk" value="110101199003074 ag" />
  <input type="text" id="empty" value="" />
  <input type="text" id="filled" value="abc" />
  <input type="text" id="a" value="" />
  <input type="text" id="b" value="" />
  <input type="text" id="sql" value="select * from t" />
  <input type="text" id="safe" value="hello" />
</body></html>`, { url: 'http://localhost' })

globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.navigator = dom.window.navigator
globalThis.HTMLElement = dom.window.HTMLElement

// Fix invalid id placeholder then set a valid one after import helpers
document.getElementById('idOk').value = '11010119900307431X'

const $ = (await import('../src/Tool.js')).default

describe('$.fn DOM helpers', () => {
  it('formTojson merges and replaces', () => {
    assert.deepEqual($('#f').formTojson({ email: 'a@b.com' }, true), {
      name: 'siyuan',
      password: '123',
      email: 'a@b.com',
    })
    assert.deepEqual($('#f').formTojson({ name: 'extra' }, true), {
      name: 'siyuan,extra',
      password: '123',
    })
    assert.deepEqual($('#f').formTojson({ name: 'extra' }, false), {
      name: 'extra',
      password: '123',
    })
  })

  it('setCurDate sets date inputs', () => {
    const el = document.createElement('input')
    el.type = 'date'
    document.body.appendChild(el)
    $(el).setCurDate()
    assert.ok(el.value)
    assert.match(el.value, /^\d{4}-\d{2}-\d{2}$/)
    el.remove()
  })

  it('checkDate validates range', () => {
    assert.equal($('#start,#end').checkDate(), true)
    assert.equal($('#start,#endBad').checkDate(), false)
  })

  it('checkSqlInjection detects risky input', () => {
    assert.equal($('#safe').checkSqlInjection(), true)
    assert.equal($('#sql').checkSqlInjection(), false)
  })

  it('RegNumber validates decimals', () => {
    assert.equal($('#num').RegNumber(3), true)
    assert.equal($('#num').RegNumber(2), false)
    assert.equal($('#num').RegNumber(), false)
  })

  it('RegPhone validates 11 digits', () => {
    assert.equal($('#phoneOk').RegPhone(), true)
    assert.equal($('#phoneBad').RegPhone(), false)
  })

  it('RegId validates id card pattern', () => {
    assert.equal($('#idOk').RegId(), true)
    assert.equal($('#phoneOk').RegId(), false)
  })

  it('hasEmpty detects empty values', () => {
    assert.equal($('#filled').hasEmpty(), false)
    assert.equal($('#filled,#empty').hasEmpty(), true)
  })

  it('dataToInput fills inputs in order', () => {
    $('#a,#b').dataToInput([1, 2])
    assert.equal($('#a').val(), '1')
    assert.equal($('#b').val(), '2')
    $('#a,#b').dataToInput({ x: 'aa', y: 'bb' })
    assert.equal($('#a').val(), 'aa')
    assert.equal($('#b').val(), 'bb')
  })

  it('nextElement invokes callback for each element', () => {
    const seen = []
    $('#a,#b').nextElement((t, i) => {
      seen.push(i)
      assert.equal(t.length, 2)
    })
    assert.deepEqual(seen, [0, 1])
  })
})

describe('$.tools utilities', () => {
  it('deepCopy isolates mutations', () => {
    const arr = [1, { a: 2 }]
    const copy = $.tools.deepCopy(arr)
    arr[0] = 9
    arr[1].a = 9
    assert.deepEqual(copy, [1, { a: 2 }])
    const obj = { a: 1, b: { c: 2 } }
    const objCopy = $.tools.deepCopy(obj)
    obj.b.c = 9
    assert.deepEqual(objCopy, { a: 1, b: { c: 2 } })
  })

  it('getCurDate formats segments', () => {
    const s = $.tools.getCurDate('-', 0, 2)
    assert.match(s, /^\d{4}-\d{1,2}-\d{1,2}$/)
    const t = $.tools.getCurDate('-', 1, 4)
    assert.match(t, /^\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}$/)
  })

  it('getRandom returns expected charset', () => {
    const n = $.tools.getRandom(8, 'number')
    assert.match(n, /^\d{8}$/)
    const w = $.tools.getRandom(8, 'word')
    assert.match(w, /^[a-zA-Z]{8}$/)
    const h = $.tools.getRandom(8, 'hybrid')
    assert.match(h, /^[0-9a-zA-Z]{8}$/)
  })

  it('countDown ticks and can be cleared', async () => {
    await new Promise((resolve, reject) => {
      let last
      const id = $.tools.countDown(3, (cd) => {
        last = cd
        if (cd <= 1) {
          clearInterval(id)
          try {
            assert.ok(last <= 2)
            resolve()
          } catch (e) {
            reject(e)
          }
        }
      })
      setTimeout(() => {
        clearInterval(id)
        reject(new Error('countDown timeout'))
      }, 4000)
    })
  })

  it('groupBy aggregates fields', () => {
    const arr = [
      { age: 15, name: '张三' },
      { age: 18, name: '李四' },
      { age: 15, name: '小王' },
    ]
    assert.deepEqual($.tools.groupBy(arr, 'age', 'name'), [
      { age: 15, name: '张三,小王' },
      { age: 18, name: '李四' },
    ])
  })

  it('jsonArrayToArray projects fields', () => {
    const arr = [
      { age: 15, name: '张三' },
      { age: 18, name: '李四' },
    ]
    assert.deepEqual($.tools.jsonArrayToArray(arr, 'age', 'name'), [
      [15, '张三'],
      [18, '李四'],
    ])
    assert.deepEqual($.tools.jsonArrayToArray(arr, 'age'), [[15], [18]])
    assert.deepEqual($.tools.jsonArrayToArray(arr), [
      [15, '张三'],
      [18, '李四'],
    ])
  })

  it('mergeArray merges in place or into new array', () => {
    const a = [1, 2]
    const b = [3, 4]
    assert.deepEqual($.tools.mergeArray(a, b, true), [1, 2, 3, 4])
    assert.deepEqual(a, [1, 2])
    assert.deepEqual($.tools.mergeArray(a, b, false), [1, 2, 3, 4])
    assert.deepEqual(a, [1, 2, 3, 4])
  })

  it('arrayHasElement finds intersection', () => {
    assert.deepEqual($.tools.arrayHasElement([1, 2, 'ds'], [1, 2, 'a', 'v', 'd']), [1, 2])
  })

  it('jsonAssignment assigns when keys match', () => {
    const a = { x: 1, y: 2 }
    const b = { x: 9, y: 8, z: 7 }
    assert.deepEqual($.tools.jsonAssignment(a, b), { x: 9, y: 8 })
    assert.equal($.tools.jsonAssignment({ x: 1, miss: 2 }, { x: 1 }), false)
  })

  it('arrayInputJsonArray / alias writes property values', () => {
    const arrAll = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
    ]
    const ages = [4, 5]
    assert.deepEqual($.tools.arrayInputJsonArray(arrAll, ages, 'age'), [
      { name: 'a', age: 4 },
      { name: 'b', age: 5 },
    ])
    const again = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
    ]
    assert.deepEqual($.tools.arrayInputJson(again, [9, 8], 'age'), [
      { name: 'a', age: 9 },
      { name: 'b', age: 8 },
    ])
    assert.equal($.tools.arrayInputJsonArray([{ a: 1 }], [1, 2], 'a'), false)
  })

  it('extractArrayFromJsonArray / alias extracts fields', () => {
    const arrAll = [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
    ]
    assert.deepEqual($.tools.extractArrayFromJsonArray(arrAll, 'name'), ['a', 'b'])
    assert.deepEqual($.tools.extractArrayFromJson(arrAll, 'name', 'age'), [
      { name: 'a', age: 1 },
      { name: 'b', age: 2 },
    ])
  })

  it('jsonArrayReplace replaces matching values', () => {
    const js = [{ a: 1 }, { a: 2 }, { a: 1 }]
    assert.deepEqual($.tools.jsonArrayReplace(js, 'a', 1, '*'), [
      { a: '*' },
      { a: 2 },
      { a: '*' },
    ])
  })

  it('findIndex locates values', () => {
    const obj = { a: '1', b: '2', c: '8', d: '2' }
    assert.deepEqual($.tools.findIndex(obj, '2'), ['b', 'd'])
    assert.equal($.tools.findIndex(obj, '8'), 'c')
    assert.equal($.tools.findIndex(obj, '28'), null)
    const arr = [1, 2, 3, 4, 1]
    assert.deepEqual($.tools.findIndex(arr, 1), [0, 4])
    const arrAll = [
      { name: 'a', age: 1 },
      { name: 'c', age: 3 },
      { name: 'c', age: 3 },
    ]
    assert.deepEqual($.tools.findIndex(arrAll, 3, 'age'), [1, 2])
  })

  it('findString checks substring', () => {
    assert.equal($.tools.findString('siyuan', 'isy'), false)
    assert.equal($.tools.findString('siyuan', 'sy'), false)
    assert.equal($.tools.findString('siyuan', 'siy'), true)
    assert.equal($.tools.findString('siyuan', 'yuan'), true)
  })

  it('arrayQueue rotates forward/backward', () => {
    assert.deepEqual($.tools.arrayQueue([1, 2, 3, 4], false), [2, 3, 4, 1])
    assert.deepEqual($.tools.arrayQueue([1, 2, 3, 4], true), [4, 1, 2, 3])
  })

  it('findIndexWithCallback collects indexes', () => {
    const t = $.tools.findIndexWithCallback([{ a: 1 }, { a: 2 }], function (curVal) {
      curVal.a > 1 && this.push(arguments[1])
    })
    assert.deepEqual(t, [1])
    const t1 = $.tools.findIndexWithCallback([1, 2, 3, 4, 5], function (curVal, index) {
      curVal > 3 && this.push(index)
    })
    assert.deepEqual(t1, [3, 4])
  })

  it('jsonStringJoin joins selected fields', () => {
    const t = { name: 'siyuan', addr: 'China', phone: '13', age: '18' }
    assert.equal(
      $.tools.jsonStringJoin(t, ['name', 'age', 'phone', 'addr'], '@'),
      'siyuan@18@13@China'
    )
  })

  it('AsciiSort sorts numbers and strings', () => {
    assert.deepEqual($.tools.AsciiSort([100, 98, 155]), [98, 100, 155])
    assert.deepEqual($.tools.AsciiSort(['mch_id', 'body', 'openid']), [
      'body',
      'mch_id',
      'openid',
    ])
    assert.deepEqual(
      $.tools.AsciiSort([{ a: 100 }, { a: 98 }, { a: 155 }], 'a'),
      [{ a: 98 }, { a: 100 }, { a: 155 }]
    )
    assert.deepEqual(
      $.tools.AsciiSort([{ a: 'mch_id' }, { a: 'openid' }, { a: 'appid' }], 'a'),
      [{ a: 'appid' }, { a: 'mch_id' }, { a: 'openid' }]
    )
  })

  it('money formats thousands separators', () => {
    assert.equal($.tools.money(5000), '5,000')
    assert.equal($.tools.money(50032154654165400), '50,032,154,654,165,400')
    assert.equal($.tools.money(12), '12')
  })

  it('_checkOption validates required keys', () => {
    const base = { a: '', b: '', c: '' }
    assert.equal($.tools._checkOption({ a: '1', b: '2', c: '3' }, base), true)
    assert.equal($.tools._checkOption({ a: '1', b: '2' }, base), false)
  })

  it('jsonp rejects empty url/callback without throwing', () => {
    const originalAlert = globalThis.alert
    let msg
    globalThis.alert = (m) => {
      msg = m
    }
    $.tools.jsonp('', '', {})
    assert.match(String(msg), /不能为空/)
    globalThis.alert = originalAlert
  })
})
