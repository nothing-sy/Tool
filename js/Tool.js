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
	setCurDateById: function() {
		$.each($(this), function(i) {
			document.getElementById($(this).attr('id')).valueAsDate = new Date();
		});

	},
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
	}

});

$.extend({

});