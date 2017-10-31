# Tool
该工具基于Jquery.js
日常应用到的工具,数据转换以及正则，表单验证，序列化等，持续更新中

### 用法

```
<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="js/Tool.js"></script>
```

### 分类
- 一类是扩展空间名tools,此空间名下的方法调用为$.tools.xxx()
- 另一类则是直接扩展fn空间名的属性和方法 $.fn.xxx()或者$('x').xxx()

## 表单数据转换为JSON

将form表单的数据转化为JSON数据，只局限于form标签 ***formTojson***
```html
<form>
	<input type="text" name="name" value="siyuan" />
	<input type="text" name="password" value="123" />
</form>
```

```javascript
/*formTojson(newObj, join)
form是表单元素，也可以通过ID，CLASS来获取元素
newObj可以额外添加一个JSON对象
join参数为true/false,如果join为true则表明，如果额外添加的对象属性与表单元素属性名一直，则合并并以逗号隔开，
join为false时，直接替换相同的属性，替换等级为：额外对象属性>form表单中排在后面的属性>form表单中排在前面的属性
*/

$('form').formTojson({email:'xxxx@163.com'},true);//{"name":"siyuan","password":"123","email":"xxxx@163.com"}
$('form').formTojson({name:'xxxx@163.com'},true);//{"name":"siyuan,xxxx@163.com","password":"123"}
$('form').formTojson({name:'xxxx@163.com'},false);//{"name":"siyuan,xxxx@163.com","password":"123"}
```

## 选择的数据转换为JSON ***dataTojson***
将jq选择器选择的对象数据转换为JSON数据，不局限于form元素

```html
<input type="text" name="c" id="c" value="5.254" /> 
<input type="text" name="d" id="d" value="4" />
```

```javascript
/*用法与上例中的formTojson一致,只是选取的对象不同*/

$('#c,#d').dataTojson({c:'xxxx@163.com'},true);//{"c":"5.254,xxxx@163.com","d":"4"}

```

## 初始化日期控件的值为当天日期 ***setCurDateById***
将jq选择器选择的日期控件默认为当前日期

```html
<input type="date" name="date" id="date" value="" />
<input type="date" name="date1" class="date" value="" />
```

```javascript

$('#date,.date').setCurDate();
```

