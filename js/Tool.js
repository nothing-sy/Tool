$.fn.extend({

	/**
	 * @param {Object} join 遇到相同的参数是否合并，合并用逗号隔开
	 * @param {Object} newObj 表单外的参数
	 */
	formTojson: function(join, newObj) {
		arguments[0] === undefined ? false : true;
		var obj = {};
		$.each($(this).serializeArray(), function(i, _obj) {

			if(obj.hasOwnProperty(_obj.name) && join) //如果已经存在，则根据条件选择是去除还是拼接在后面
			{
				obj[_obj.name] += ',' + _obj.value;
			} else {
				obj[_obj.name] = _obj.value;
			}
		});
		return $.extend(true, obj, newObj);
	},
	/**
	 * 通过ID设置 日期控件 为当天
	 */
	setCurDateById: function() {
		$.each($(this), function(i) {
			document.getElementById($(this).attr('id')).valueAsDate = new Date();
		});

	},
	/**
	 * 验证起始日期和终止日期的有效性
	 */
	checkDate: function() {
		var check_ok = true;
		var DateObj = new Array();
		$.each($(this), function(i) {
			DateObj.push(new Date($(this).val()));
		});
		if(DateObj[0].getTime() > DateObj[1].getTime()) {

			check_ok = false;
		}

		return check_ok;
	},
	
	/**
	 * 指定当前选中元素所具有的动作，并设置当前元素与下一个元素的关系
	 * @param {Object} Func  匿名函数，用于设置当前元素的动作和下一个元素的动作联系，$(t)为当前元素，list为选中的元素列表，
	 * 所以要控制元素列表中当前元素的下一个元素，只需要$(list[i+1]).focus()即可
	 */
	nextElement:function(Func)
	{
		var list=[];
		$(this).each(function(i){			
			list.push(this);
			Func(this,list,i);
			
		});
		//callback;
	}

});
//自定义命名空间 rap
$.extend({
rap:{
	

	
}
});


