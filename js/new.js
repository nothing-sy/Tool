var $=require('./Tool');
var arrAll=	[{name:'a',age:1},{name:'b',age:2},{name:'c',age:3},{name:'d',age:4}];
var arr=[1,2,3,4];
var newarr=$.tools.arrayQueue(arr);
//var newJSON=$.tools.jsonAssignment(arrAll,newarr);
console.log(JSON.stringify(arr));
//console.log(JSON.stringify(newJSON));


//提取JSON数据中某个属性的值作为新的数组

var arrAll=$.tools.arrayInputJson(arrAll,arr,'age');
console.log(JSON.stringify(arrAll));

console.log(JSON.stringify($.tools.extractArrayFromJson(arrAll,'name')));
