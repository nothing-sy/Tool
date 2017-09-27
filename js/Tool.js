$.fn.extend({

	/**
	 * @param {Object} join 遇到相同的参数是否合并，合并用逗号隔开
	 * @param {Object} newObj 表单外的参数
	 */
	formTojson: function(newObj, join) {
		var obj = {};
		newObj = arguments[0] ? arguments[0] : {};
		//首先把表单里面的内容进行合并，如果name一样可以通过join参数设置是否用逗号隔开并合并
		$.each($(this).serializeArray(), function(i, _obj) {
			if(obj.hasOwnProperty(_obj.name) && join) {
				obj[_obj.name] += ',' + _obj.value;
			} else {
				obj[_obj.name] = _obj.value;
			}
		});
		$.each(newObj, function(key, value) {
			if(obj.hasOwnProperty(key) && join) {
				obj[key] += ',' + value;
			} else {
				obj[key] = value;
			}

		});
		return obj;
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
	nextElement: function(Func) {
		var list = [];
		$(this).each(function(i) {
			list.push(this);
			Func(this, list, i);

		});

	},

	/**
	 * 正则检测是否为小数
	 * @param {Object} num
	 */
	RegNumber: function(num) {
		arguments[0] > 0 ? num : num = 2;
		var res = true;
		$.each($(this), function() {

			if(!(eval('/^\\d+(\.\\d{1,' + num + '})?$/').test($(this).val()))) {
				res = false;
			}

		});

		return res;

	},
	RegPhone: function() {
		//console.log(1)
		var res = true;
		$.each($(this), function() {
			//只要11位数就好，不去检查什么数字开头了。。随时变得。
			if(!/^\d{11}$/.test($(this).val())) {
				//return false;
				res = false;
			}

		});

		return res;

	}

});
//自定义命名空间 rap
$.extend({
	tools: {
		jsonp: function(url, callbackFunc, data) //跨域请求
		{

			var data = arguments[2] ? arguments[2] : ''; //默认参数为空
			//var type = arguments[3] ? arguments[3] : 'get'; //默认类型为GET

			if(url != '' && callbackFunc != '') {
				$.ajax({
					type: 'get',
					dataType: 'jsonp',
					url: url,
					jsonp: "callback",
					jsonpCallback: callbackFunc,
					data: data,
					async: true,
					success: function(data) {
						console.log('跨域请求成功');
						//mui.alert('跨域请求成功');

					},
					error: function() {

						console.log('跨域请求失败');
						//mui.alert('跨域请求失败')

					}
				});

			} else
				alert('URL，回调函数不能为空');

		},

		/**
		 * @param {Object} num 想要返回的位数
		 * @param {Object} type 是纯数字还是字母还是混合,默认混合类型，String类型，'number','word','hybrid'
		 */
		getRandom: function(num, type) {

			type = arguments[1] ? arguments[1] : 'hybrid';
			var arr, res = '';

			switch(type) {
				case 'number':
					arr = '0123456789';
					break;
				case 'word':
					arr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					break;
				case 'hybrid':
					arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					break;
			}
			for(var i = 0; i < num; i++) {
				res += arr[Math.floor(Math.random() * (arr.length - 1))];
			}
			return res;
		}
	}
});