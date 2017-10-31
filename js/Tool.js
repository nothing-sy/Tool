$.fn.extend({

	/**
	 * @param {Object} join 遇到相同的参数是否合并，合并用逗号隔开
	 * @param {Object} newObj 表单外的参数
	 */
	formTojson: function(newObj, join) {
		var obj = {};
		newObj = arguments[0] ? arguments[0] : {};
		//join=arguments[1]?arguments[1]:false;//默认替换而不是用逗号隔开
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
	 * 将选择的数据转换成JSON数据，不局限于 表单序列化数据
	 * @param {Object} join
	 * @param {Object} newObj
	 */
	dataTojson: function(newObj, join) {
		var obj = {};

		newObj = arguments[0] ? arguments[0] : {};
		//首先把表单里面的内容进行合并，如果name一样可以通过join参数设置是否用逗号隔开并合并
		$.each($(this), function(i, _obj) {
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
	setCurDate: function() {
		$.each($(this), function(i) {
			this.valueAsDate = new Date();
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
	 * 正则验证小数位数
	 * @param {Object} num
	 */
	RegNumber: function(num) {
		arguments[0] > 0 ? num : num = 2;
		var res = true;
		$.each($(this), function() {

			if(!(eval('/^\\d+(\.\\d{1,' + num + '})?$/g').test($(this).val()))) {
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
	},
	/**
	 * 是否有空值
	 */
	hasEmpty: function() {
		var isok = false;
		$.each($(this), function() {
			if($(this).val() == '') {
				isok = true;
			}
		});

		return isok;

	},
	/**
	 * 目前仅支持array和JSON,按顺序填写，超过的部分不予处理
	 * @param {Object} obj
	 */
	dataToInput: function(obj) {
		var _t = $(this),
			i = 0;
		$.each(obj, function(key, value) {
			if(i < $(_t).length) {

				$(_t[i]).val(value);

				i++;
			}


		});

	}

});
//自定义命名空间 rap
$.extend({
	tools: {
		cd: 0,
		jsonp: function(url, callbackFunc, data) //跨域请求
		{

			var data = arguments[2] ? arguments[2] : ''; //默认参数为空
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
					},
					error: function() {

						console.log('跨域请求失败');
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
		},

		/**
		 * 倒计时秒数 ，不对负数做判断，自行处理
		 * @param {Object} time 默认倒数时间，时间单位为s
		 * @param {Object} Func 回调函数 参数 剩余时间
		 */
		countDown: function(time, Func) {

			time = arguments[0] ? arguments[0] : 60;
			//t.cd=time;
			//如果两个参数都没有传递，则默认为倒计时60s
			return setInterval(function() {

				Func(--time);

			}, 1000);

		},
		/**
		 * 深拷贝JSON或者数组对象
		 * @param {Object} oldValue 被拷贝的值
		 */
		deepCopy: function(oldValue) {
				if(oldValue instanceof Array)
				{
			return $.extend(true, [], oldValue);		
					
				}
				else
				{
					return $.extend(true, {}, oldValue);
				}
			

		},
		/**
		 * 根据某个字段进行分组得出结果，接收数组类型，格式为[{yd:'a',res:'1'},{yd:'b',res:'2'},{yd:'a',res:'3'}]
		 * 最终返回结果为[{yd:'a',res:'1,3'},{yd:'b',res:'2'}]
		 * @param {Object} arr 传入的数组
		 * @param {Object} groupby 需要分类的属性名，比如此处的 yd 
		 * @param {Object} res 需要分类统计的属性名，比如此处要统计 res  
		 */
		groupBy: function(arr, groupby, res) {
			var group = [];
			var hasRecord = false;
			var curGroupIndex;
			$.each(arr, function(i) {
				$.each(group, function(y) {
					if(arr[i][groupby] == group[y][groupby]) {

						curGroupIndex = y;
						hasRecord = true;

					}

				});
				if(!hasRecord) {
					var jsons = {};
					jsons[groupby] = arr[i][groupby];
					jsons[res] = arr[i][res];
					group.push(jsons);

				} else {
					group[curGroupIndex][res] += ',' + arr[i][res];
					hasRecord = false;

				}

			});

			return group;
		},

		/**
		 * JSON数组转数组
		 * 例子：var n = jsonToarray(list, 'pay', 'processType');//如果只传入数组，则默认保存所有JSON数据
		 * 输出 "[["365","2"],["3265","22"]]" ，结果顺序为[[pay,processType],[pay,processType]];
		 * 
		 * @param {Object} js JSON数组
		 * @param {Object} arg1 指定需要的JSON数据，也可以用来指定数组排序
		 */
		jsonArrayToArray: function(js) {

			var argLnt = arguments.length;
			var arg = arguments;
			var list = [];
			if(argLnt > 1) {

				$.each(js, function(i) {
					var newArray = [];
					for(var ob = 1; ob < argLnt; ob++) {

						newArray.push(js[i][arg[ob]]); //此处，每个函数内部都有一个arguments参数，所以这里要用的是jsonToarray的参数				
					}

					list.push(newArray);
				});

			} else {
				$.each(js, function(i) {
					var newArray = [];

					$.each(js[i], function(key) {

						newArray.push(js[i][key]);
					});
					list.push(newArray);
				});

			}
			return list;
		},
	
	/**
	 * 获取当前时间，start和end的参数为 0-5分别对应年月日时分秒，想要获取的月日时分，则start=1,end=4
	 * @param {Object} split 日期间隔符
	 * @param {Object} start 开始
	 * @param {Object} end 结束
	 */
	getCurDate: function(split, start, end) {
		var d = new Date();
		var dateList = [],
			res = '';
		split = arguments[0] ? arguments[0] : '/';
		start = arguments[1] ? arguments[1] : 0;
		end = arguments[2] ? arguments[2] : 5;
		dateList.push(d.getFullYear());
		dateList.push(d.getMonth() + 1);
		dateList.push(d.getDate());
		dateList.push(d.getHours());
		dateList.push(d.getMinutes());
		dateList.push(d.getSeconds());
		for(i = start; i < end + 1; i++) {
			if(i < 2) {
				if(i != end) {
					res += dateList[i] + split;
				} else {
					res += dateList[i];
				}

			} else if(i == 2) {

				if(i != end) {
					res += dateList[i] + ' ';
				} else {
					res += dateList[i];
				}

			} else {
				if(i != end) {
					res += dateList[i] + ':';
				} else {
					res += dateList[i];
				}
			}

		}

		return res;

	}
	}
})