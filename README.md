# Tool
该工具基于Jquery.js
日常应用到的工具，比如正则，表单验证，序列化等，持续更新

### 用法
```
<script type="text/javascript" src="js/jquery-3.1.1.min.js"></script><br/>
<script type="text/javascript" src="js/Tool.js"></script>
```

#### 表单序列化方法
```
$('form').formTojson(join,newObj);//返回 JSON对象<br/>
join: 遇到参数名一致的时候是否合并，如bootstrap提供的select 多选的情况或者，newObj与表单参数名一致的情况 【true/false】，合并之后，参数值用逗号隔开。 false:表单以最后一个同名参数或newObj的参数值为准 <br/>
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
