# jqtools

基于 jQuery 的日常工具集，覆盖 DOM 操作与数据处理：表单 ↔ JSON、日期、正则校验、深拷贝、数组 / JSON 分组与转换等。

[![npm](https://img.shields.io/npm/v/jqtools.svg)](https://www.npmjs.com/package/jqtools)

## 安装

```bash
npm install jqtools jquery
```

> `jquery` 为 peerDependency，需自行安装（`>=3.0.0`）。

## 用法

```js
import $ from 'jqtools'

// jQuery 实例方法
$('form').formTojson()

// 工具命名空间
$.tools.getCurDate('-', 0, 2)
```

浏览器中也可先引入 jQuery，再引入构建产物 `lib/main.mjs`（需支持 ES Module）。

## API 一览

| 类型 | 调用方式 | 说明 |
|------|----------|------|
| 实例方法 | `$(sel).method()` | 作用在选中的 DOM / 表单元素上 |
| 工具方法 | `$.tools.method()` | 纯数据处理，不依赖特定选择器 |

---

## 实例方法 `$.fn`

### formTojson(newObj?, join?)

将表单（或带 `name` 的控件集合）序列化为 JSON。

- `newObj`：额外合并的字段
- `join`：`true` 时同名字段用逗号拼接；`false` / 省略时后者覆盖

```js
$('form').formTojson({ email: 'a@b.com' }, true)
// => { name: 'siyuan', password: '123', email: 'a@b.com' }

$('form').formTojson({ name: 'extra' }, true)
// => { name: 'siyuan,extra', password: '123' }

$('form').formTojson({ name: 'extra' }, false)
// => { name: 'extra', password: '123' }
```

### setCurDate()

将选中的 `date` 控件设为当天。

```js
$('#date,.date').setCurDate()
```

### checkDate()

校验起始 / 结束日期：第一个元素为开始，第二个为结束，结束须 ≥ 开始。

```js
$('#start,#end').checkDate() // true | false
```

### checkSqlInjection()

粗粒度检测输入中是否含常见 SQL 敏感片段；无敏感字符返回 `true`。

```js
$('input').checkSqlInjection()
```

### nextElement(callback)

为每个选中元素绑定「与下一个元素」的关系；`callback(t, i)` 中 `t` 为整组元素，`i` 为当前下标。

```js
$('input').nextElement(function (t, i) {
  $(t[i]).on('keyup', function (event) {
    if (event.keyCode === 13) $(t[i + 1]).focus()
  })
})
```

### RegNumber(num?)

校验是否为合法数字，小数位不超过 `num`（默认 `2`）。

```js
$('#c').RegNumber(3) // '5.294' => true
```

### RegPhone()

仅校验是否为 11 位数字。

```js
$('#phone').RegPhone()
```

### RegId()

按大陆 18 位身份证号格式校验（含末位 `X`）。

```js
$('#id').RegId()
```

### hasEmpty()

选中元素中是否存在空字符串值。

```js
$('#c,#d').hasEmpty()
```

### dataToInput(obj)

按顺序将数组或对象的值写入选中输入框（超出控件数量的数据忽略）。

```js
$('#a,#b').dataToInput([1, 2])
$('#a,#b').dataToInput({ x: 'aa', y: 'bb' })
```

---

## 工具方法 `$.tools`

### getCurDate(split?, start?, end?)

获取当前时间片段字符串。`start` / `end` 为 `0–5`，对应 年/月/日/时/分/秒。

```js
$.tools.getCurDate('-', 1, 4) // 例如 "11-12 17:49"
```

### deepCopy(obj)

深拷贝数组或普通对象。

```js
const copy = $.tools.deepCopy({ a: 1, b: { c: 2 } })
```

### getRandom(num, type?)

生成指定位数随机串。`type`：`'number'` | `'word'` | `'hybrid'`（默认）。

```js
$.tools.getRandom(5, 'number') // "00622"
$.tools.getRandom(5, 'word')   // "tbEYI"
$.tools.getRandom(5)           // 混合
```

### countDown(time, Func)

秒级倒计时；返回 `setInterval` 的 id，可用 `clearInterval` 取消。回调参数为剩余秒数。

```js
const id = $.tools.countDown(60, (cd) => console.log(cd))
```

### groupBy(jsonArray, groupby, res)

按某字段分组，并将另一字段值用逗号聚合。

```js
$.tools.groupBy(
  [{ age: 15, name: '张三' }, { age: 15, name: '小王' }, { age: 18, name: '李四' }],
  'age',
  'name'
)
// => [{ age: 15, name: '张三,小王' }, { age: 18, name: '李四' }]
```

### jsonArrayToArray(js, ...keys)

JSON 数组投影为二维数组；不传 `keys` 时按对象属性顺序展开全部值。

```js
$.tools.jsonArrayToArray(arr, 'age', 'name')
// => [[15, '张三'], ...]
```

### mergeArray(first, second, newArray?)

合并数组。`newArray === true` 返回新数组；否则原地合并到 `first`（默认）。

```js
$.tools.mergeArray([1, 2], [3], true)  // [1, 2, 3]
```

### arrayHasElement(obj, arr)

返回 `arr` 中出现在 `obj`（数组/类数组）里的元素。

```js
$.tools.arrayHasElement([1, 2, 'ds'], [1, 2, 'a']) // [1, 2]
```

### jsonAssignment(objA, objB)

将 `objB` 中与 `objA` 共有的键赋值给 `objA`；若 `objA` 存在 `objB` 没有的键则返回 `false`。

```js
$.tools.jsonAssignment({ x: 1, y: 2 }, { x: 9, y: 8, z: 0 })
// => { x: 9, y: 8 }
```

### arrayInputJsonArray(j, a, p) / arrayInputJson(...)

把数组 `a` 按序写入 JSON 数组 `j` 的属性 `p`（长度须一致）。`arrayInputJson` 为兼容别名。

```js
$.tools.arrayInputJsonArray(
  [{ name: 'a', age: 1 }, { name: 'b', age: 2 }],
  [4, 5],
  'age'
)
```

### extractArrayFromJsonArray(j, ...props) / extractArrayFromJson(...)

从 JSON 数组抽取属性：单属性返回一维数组，多属性返回对象数组。短名称为兼容别名。

```js
$.tools.extractArrayFromJsonArray(list, 'name')
// => ['a', 'b', ...]

$.tools.extractArrayFromJsonArray(list, 'name', 'age')
// => [{ name: 'a', age: 1 }, ...]
```

### jsonArrayReplace(obj, prop, oldV, newV)

替换 JSON 数组中指定属性的匹配值（严格相等）。

```js
$.tools.jsonArrayReplace([{ a: 1 }, { a: 2 }], 'a', 1, '*')
// => [{ a: '*' }, { a: 2 }]
```

### findIndex(obj, val, condition?)

在数组、对象或 JSON 数组中查找值的索引 / 键；多结果返回数组，未找到返回 `null`。JSON 数组需传 `condition` 属性名。

```js
$.tools.findIndex([1, 2, 3, 4, 1], 1)           // [0, 4]
$.tools.findIndex(list, 3, 'age')               // 下标数组或单个下标
```

### findString(str, val)

判断 `str` 是否包含子串 `val`（`indexOf`）。

```js
$.tools.findString('siyuan', 'siy')  // true
$.tools.findString('siyuan', 'sy')   // false（非连续子串）
```

### arrayQueue(arr, turn?)

轮转数组：`turn` 默认 `false` 为队首到队尾；`true` 为队尾到队首。会修改原数组。

```js
$.tools.arrayQueue([1, 2, 3, 4])       // [2, 3, 4, 1]
$.tools.arrayQueue([1, 2, 3, 4], true) // [4, 1, 2, 3]
```

### findIndexWithCallback(obj, callback)

自定义条件收集下标；回调中 `this` 为结果数组。

```js
$.tools.findIndexWithCallback([1, 2, 3, 4, 5], function (curVal, index) {
  curVal > 3 && this.push(index)
})
// => [3, 4]
```

### jsonStringJoin(obj, arr, sep)

按属性名列表拼接对象字段。

```js
$.tools.jsonStringJoin(
  { name: 'siyuan', age: '18', phone: '13' },
  ['name', 'age', 'phone'],
  '@'
)
// => "siyuan@18@13"
```

### AsciiSort(obj, attr?)

升序排序：数字按大小，其它按字典序。JSON 数组可指定 `attr`。

```js
$.tools.AsciiSort([100, 98, 155])
$.tools.AsciiSort(['mch_id', 'body', 'openid'])
$.tools.AsciiSort([{ a: 100 }, { a: 98 }], 'a')
```

### money(m)

金额千分位格式化。

```js
$.tools.money(5000) // "5,000"
```

### \_checkOption(opt, defaultOption)

检查 `opt` 是否包含 `defaultOption` 的全部键。

```js
$.tools._checkOption({ a: 1, b: 2 }, { a: '', b: '', c: '' }) // false
```

### jsonp(url, callbackFunc, data?)

发起 JSONP 请求（依赖 jQuery `ajax`）。`url` 与回调名不可为空。

```js
$.tools.jsonp('https://example.com/api', 'getResponse', { name: 'siyuan' })
```

---

## 开发

```bash
npm install
npm test          # Node 内置 test runner + jsdom
npm run build     # 输出 lib/main.mjs（jquery 为 external）
```

## License

ISC
