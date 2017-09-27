# Tool
该工具基于Jquery.js
日常应用到的工具，比如正则，表单验证，序列化等，持续更新

### 用法
```
<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script><br/>
<script type="text/javascript" src="js/Tool.js"></script>
```

#### 表单序列化并转换为JSON数据
```
$('form').formTojson(newObj,join);//返回 新的JSON对象<br/>
join: 遇到参数名一致的时候是否合并,如果合并则以逗号隔开，比如{a:'1,2'}而并非{a:'1',a:'2'}的形式存在，如果false或者不填，则根据顺序替换相同属性，替换顺序为：newObj的属性>在表单中排序靠后的>在表单中排序靠前的
newObj : 表单之外的额外参数，JSON数据
```
#### 通过ID设置input type='date'的控件，默认设置为当天时间
`$('#beginDate,#endDate').setCurDateById();`

#### 验证两个日期的有效性，即 A日期是否小于等于B日期，便于验证和传输有效数据
`$('#beginDate,#endDate').checkDate();//通过ID验证`

#### 设置当前元素列表中元素的事件或 每个元素与其所在列表的下一个元素之间的关系
```
$('input').nextElement(function(t,list,index){// t 元素，list  jq选择器选取的元素列表,index 元素的索引
$(t).on('keyup',function(event){
if(event.keyCode==13)
{
$(list[index+1]).focus();
}
})
})
```

#### 新增正则表达式验证数字（小数点）
```
$('#a,.b').RegNumber(num);//num非必填。验证所选元素值是否为数字，默认为两位小数点，num设置小数点后几位，小于0默认两位小数


```
#### Jsonp跨域(GET方式)

```
$.tools.jsonp(url, callbackFunc, data);//url:请求路径 (string)，callbackFunc ：回调函数名（string）,data (JSON数据)
//例子：
$.tools.jsonp('xx.do','getData',{content:'test'});

//写对应的回调函数,res为返回给前端的JSON格式数据
//后台获取参数名为 callback的参数，并拼接 前端请求的数据 返回给前端 即返回例子中的： "getData({xxx:'xxx'})",该回调函数不允许定义在任何函数内部
function getData(res)
{
// do something
}
```
