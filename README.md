# Tool
基于Jquery.js日常应用到的工具,主要用于DOM操作和数据处理，如表单数据转化成JSON，设置初始日期，正则验证，JSON数组转换，JSON数组分类等

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
$('form').formTojson({name:'xxxx@163.com'},false);//{"name":"xxxx@163.com","password":"123"}
```

## 选择的数据转换为JSON -***dataTojson***
将jq选择器选择的对象数据转换为JSON数据，不局限于form元素

```html
<input type="text" name="c" id="c" value="5.254" /> 
<input type="text" name="d" id="d" value="4" />
```

```javascript
/*用法与上例中的formTojson一致,只是选取的对象不同。
 这个函数也可以用于把数组元素转换成JSON
 $.fn.dataTojson([1,2,3]);//{"0":1,"1":2,"2":3}
 
 */

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

## 深拷贝数组或者JSON对象 -***deepCopy***

```javascript
	var arr=[1,2,3];
	var jsons={a:1,b:2,c:3};
	var newArr=$.tools.deepCopy(arr);
	var newJson=$.tools.deepCopy(jsons);
	arr[0]=9;
	jsons.a=9;
	console.log(JSON.stringify(arr));//[9,2,3]
	console.log(JSON.stringify(jsons));//{"a":9,"b":2,"c":3}
	console.log(JSON.stringify(newArr));//[1,2,3]
	console.log(JSON.stringify(newJson));//{"a":1,"b":2,"c":3}
```

## 检验小数位数 -***RegNumber***
```html
	<input type="text" name="c" id="c" value="5.294" /> 
			
```

```javascript
//RegNumber(num) num=>检测小数点位数，该值默认为两位小数，不可小于0
$('#c').RegNumber(3);//true
```

## 检验手机位数 -***RegPhone***

```javascript
//只单纯检测是否为11位，不作其他有效值判断，如有需要自行改变正则匹配
console.log($('#c').RegPhone());
```

## 检验JQ对象中是否含有空值 - ***hasEmpty***

```html
<input type="text" name="c" id="c" value="1234567w8901" /> 
			<input type="text" name="d" id="d" value="" />

```

```javascript
$('#c,#d').hasEmpty();//true
```


## 将数据填入表单数据中 - ***dataToInput***
根据传入对象数据顺序填入表单控件中,超过输入控件的数据不会进行处理

```javascript
var a=[1,2];
var jsons={a:'a',b:'b'};
$('#c,#d').dataToInput(a);
$('#c,#d').dataToInput(jsons);
```

## jsonp跨域请求 - ***jsonp***
$.tools.jsonp(url, callbackFunc, data); //url 请求地址，callbackFunc： 回调函数名，data:传输的数据
```javascript
$.tools.jsonp('http://www.xxx.com/xx.php','getResponce',{name:'siyuan'});
//需要写一个与getResponce一样的回调函数。此处后台接受请求返回的格式如下
//事实上 jsonp也并非一定要通过回调函数，只要跟后台返回的格式一一对应，我们同样能用数组、对象来存储数据
/*
  $fun=$_GET['callback'];//获取传递过来的函数名
$name=$_GET['name'];
 $data="{age:18,name:'$name'}";//需要返回的数据
 echo "$fun($data)";
 */

function getResponce(res)
{
	alert(res.name+res.age);//siyuan18
	
}

```
## 获取随机数 - ***getRandom***

getRandom(num, type);//num:获取位数，type:'number','word','hybrid'，意思是返回纯数字，纯字母，或者混合型随机数

```
console.log($.tools.getRandom(5,'number'));//00622
console.log($.tools.getRandom(5,'word'));//tbEYI
console.log($.tools.getRandom(5,'hybrid'));//F9liT
```

## 倒计时 -***countDown***
```javascript
//$.tools.countDown(time,Func[cd]);
//time:倒计时，cd:剩余时间,返回值：一个可以传递给 Window.clearInterval() 从而取消对 code 的周期性执行的值。
$.tools.countDown(60,function(cd){	
	console.log(cd);	
});
```

## JSON数组分组函数 - ***groupBy***
groupBy(arr, groupby, res) //arr:json数组,groupby:按某个属性分组 ,res：按groupby分组后得到的集合属性,
【返回值】分组后的JSON数组

```javascript
var arr=[{age:15,name:'张三'},{age:18,name:'李四'},{age:12,name:'王五'},{age:15,name:'小王'},{age:12,name:'老王'}];
var arr1=[{age:15,name:'张三'},{age:18,name:'李四'},{age:12,name:'张三'},{age:15,name:'小王'},{age:12,name:'张三'}];

console.log(JSON.stringify($.tools.groupBy(arr,'age','name')));//"[{"age":15,"name":"张三,小王"},{"age":18,"name":"李四"},{"age":12,"name":"王五,老王"}]"
console.log(JSON.stringify($.tools.groupBy(arr1,'name','age')));//"[{"name":"张三","age":"15,12,12"},{"name":"李四","age":18},{"name":"小王","age":15}]"

```

## JSON数组转换成数组- ***jsonArrayToArray***
		 * 例子：var n = jsonToarray(list, 'pay', 'processType');//如果只传入数组，则默认保存所有JSON数据
		 * 输出 "[["365","2"],["3265","22"]]" ，结果顺序为[[pay,processType],[pay,processType]];
		 * 
		 * @param {Object} js JSON数组
		 * @param {Object} arg1 指定需要的JSON数据，也可以用来指定数组排序
		 *@param {Object} arg2
		 *@param {Object} arg3 ....
```javascript
var arr=[{age:15,name:'张三'},{age:18,name:'李四'},{age:12,name:'王五'},{age:15,name:'小王'},{age:12,name:'老王'}];
console.log(JSON.stringify($.tools.jsonArrayToArray(arr,'age','name')));// "[[15,"张三"],[18,"李四"],[12,"王五"],[15,"小王"],[12,"老王"]]"
console.log(JSON.stringify($.tools.jsonArrayToArray(arr,'age')));//[[15],[18],[12],[15],[12]]
console.log(JSON.stringify($.tools.jsonArrayToArray(arr)));//"[[15,"张三"],[18,"李四"],[12,"王五"],[15,"小王"],[12,"老王"]]"

```
## 合并数组- ***mergeArray***
$.tools.mergeArray(first,secone,newArray);//first:合并的第一个数组，secone：合并的第二个数组，
newArray是否需要返回新数组，还是合并到first数组，默认(false)合并到first数组并返回,true则返回新数组

```javascript
var a=[1,2],b=[2,3],c=[4,5];
/*
var t=$.tools.mergeArray(a,b,true);
var t=$.tools.mergeArray(a,b,false);*/
var t=$.tools.mergeArray(a,b);
console.log(JSON.stringify(a));//"[1,2,2,3]"
console.log(JSON.stringify(b));//"[2,3]"	
console.log(JSON.stringify(t));//"[1,2,2,3]"	

```

## 搜索数组内容- ***arrayHasElement***
$.tools.arrayHasElement(obj,arr);//obj:需要搜索的对象，目前只支持array/json   arr:搜索目标，查找arr中是否有obj中的数据
//返回查找到的数据数组
```javascript
$.tools.arrayHasElement([1,2,'ds'],[1,2,'a','v','d']);//[1,2]
```