var $=require('./Tool');
/*var arrAll=	[{name:'a',age:1,l:5},{name:'b',age:2,l:5},{name:'c',age:3,l:5},{name:'d',age:4,l:5},{name:'c',age:3,l:5}];
var arr=[1,2,3,4,1];
console.log($.tools.findIndex(arr,'1'));
console.log($.tools.findIndex(arrAll,'3','age'));
*/

console.log(JSON.stringify($.tools.extractArrayFromJsonArray([{name:1,age:18,l:9},{name:2,age:25,l:8}],'name','age')));
