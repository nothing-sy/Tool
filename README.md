# Tool
基于Jquery.js日常应用到的工具,数据转换以及正则，表单验证，序列化等，持续更新中

### 用法

```
<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="js/Tool.js"></script>
```

### 分类
- 一类是扩展空间名tools,此空间名下的方法调用为$.tools.xxx()
- 另一类则是直接扩展fn空间名的属性和方法 $.fn.xxx()或者$('x').xxx()

## 表单数据转换为JSON -***formTojson***

将form表单的数据转化为JSON数据，只局限于form标签 
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

## 选择的数据转换为JSON -***dataTojson***
将jq选择器选择的对象数据转换为JSON数据，不局限于form元素

```html
<input type="text" name="c" id="c" value="5.254" /> 
<input type="text" name="d" id="d" value="4" />
```

```javascript
/*用法与上例中的formTojson一致,只是选取的对象不同*/

$('#c,#d').dataTojson({c:'xxxx@163.com'},true);//{"c":"5.254,xxxx@163.com","d":"4"}

```

## 初始化日期控件的值为当天日期 -***setCurDate***
将jq选择器选择的日期控件默认为当前日期

```html
<input type="date" name="date" id="date" value="" />
<input type="date" name="date1" class="date" value="" />
```

```javascript

$('#date,.date').setCurDate();
```

## 检测日期选择条件是否正确 -***checkDate***
日期选择条件的检查，结束日期必须大于等于初始日期

```html
<input type="date" name="date" id="date" value="" />
<input type="date" name="date1" class="date" value="" />
```

```javascript
//第一个选取的对象是初始日期，第二个则为结束日期，返回boolean
$('#date,.date').checkDate();//true/false
```

## 获取当前具体日期时间 -***getCurDate***
日期选择条件的检查，结束日期必须大于等于初始日期


```javascript
//第一个选取的对象是初始日期，第二个则为结束日期，返回字符串
//参数getCurDate(split, start, end),split为日期分隔符,start,end参数为0-5，分别对应年月日时分秒
$.tools.getCurDate('-',1,4);//"10-31 17:49"
```

## 指定当前元素与下一个元素的关系 -***nextElement***
在JQ对象中，指定选取对象的当前元素与下一个元素的关系，比如，按下enter键，下一个元素要做什么动作

```html
<input type="text" name="c" id="c" value="5.254" /> 
<input type="text" name="d" id="d" value="4" />

```

```javascript
//nextElement(callback[t,list,i])=>t表示选取的元素列表中的每一个元素，list表示元素列，i表示下标
//以下内容的效果为，绑定所有input元素，enter键keyup的时候，使下一个元素onfocus
$('input').nextElement(function(t, list, i) {
				$(t).on('keyup', function(event) {
					if(event.keyCode == 13) {
						$(list[i + 1]).focus();
					}
				})
			});

```

