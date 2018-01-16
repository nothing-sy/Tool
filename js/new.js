var $=require('./Tool');

/*var t=$.tools.findIndexWithCallback([{a:1},{a:2}],function(curVal,index){
				curVal.a>1&&this.push(index);			
			});
			
var t1=$.tools.findIndexWithCallback([1,2,3,4,5,6],function(curVal,index){
				curVal>3&&this.push(index);			
			});
console.log(JSON.stringify(t));
console.log(JSON.stringify(t1));*/

var t={name:'siyuan',addr:'China-sichuan',phone:'13xxxxx',age:'18'};
console.log($.tools.jsonStringJoin(t,['name','age','phone','addr'],'@'));

