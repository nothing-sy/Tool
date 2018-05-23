var $ = require("jquery");
//require('sweetalert');
$.fn.extend({
	/**
	 * 可选取的元素包括form或者自选元素比如:$('form')  和 $('#a,#b')
	 * @param {Object} join 遇到相同的参数是否合并，合并用逗号隔开
	 * @param {Object} newObj 传入控件以外的的JSON数据参数
	 */
	formTojson: function(newObj, join) {
		var obj = {},
			arr;
		newObj = arguments[0] || {};
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
	 * @param {Object} Func  匿名函数，用于设置当前元素的动作和下一个元素的动作联系，$(t)选中的所有元素，
	 * 所以要控制元素列表中当前元素的下一个元素，只需要$(t[i+1]).focus()即可
	 */
	nextElement: function(Func) {
		var t = $(this);
		$(this).each(function(i) {
			Func(t, i);
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
	RegId: function() {

		var res = true;
		$.each($(this), function() {

			if(!/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test($(this).val())) {
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
		 * 数组队列,用于一组循环排列的数据 [1,2,3,4]=》[2,3，4,1] //如果是 JSON数组，需要排序某些属性而不更改原本的位置，则单独抽取出那个属性作为数组，再重新赋值
		 * @param {Object} arr 需要排列的数组
		 * @param {Object} turn 第一个排到最后面 OR  最后面排到最前面 默认向后排队(false)
		 */
		arrayQueue: function(arr, turn) {

			turn && arr.unshift(arr.pop()) || arr.push(arr.shift());
			return arr;
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
			if(oldValue instanceof Array) {
				return $.extend(true, [], oldValue);

			} else {
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
			dateList.push(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
			for(i = start; i < end + 1; i++) {
				i < 2 && (i != end && (res += dateList[i] + split) || (res += dateList[i])) || i == 2 && (i != end && (res += dateList[i] + ' ') || (res += dateList[i])) || (i != end && (res += dateList[i] + ':') || (res += dateList[i]));

			}
			return res;

		},
		mergeArray: function(fir, sec, newArray) {

			if(newArray) //如果需要返回新的数组
			{
				var resArray = [];
				resArray.push.apply(resArray, fir);
				resArray.push.apply(resArray, sec);
				return resArray;
			} else {
				Array.prototype.push.apply(fir, sec);
				return fir;
			}

		},
		/**
		 * 查询数组中是否存在指定的数据，目前只支持传入Object,返回查找出的数据数组
		 * @param {Object} obj 查找目标
		 * @param {Object} arr 查找对象
		 */
		arrayHasElement: function(obj, arr) {
			return arr.filter(function(el) {
				var obj = this;
				var res;
				$.each(obj, function(i) {
					if(el == obj[i]) {
						res = el;
					}
				});
				return res;
			}, obj);

		},
		/**
		 * 对象赋值，把B属性的值赋值给A,是赋值不是复制，两者结构必须一致，如果不一致，返回false，赋值成功返回赋值后的对象
		 * @param {Object} a
		 * @param {Object} b
		 */
		jsonAssignment: function(a, b) {
			var res = true;
			for(key in a) {

				key in b || (res = false);

			}
			return res && ((function() {
				for(key in a) {

					a[key] = b[key];

				};
			})(), a) || false;
		},
		/**
		 * 将数组按顺序赋值给JSON的某个属性
		 * @param {Object} j json数组
		 * @param {Object} a 数组
		 * @param {Object} p 属性名
		 */
		arrayInputJsonArray: function(j, a, p) {
			return j.length == a.length && (function() {
				for(i in j) {
					j[i][p] = a[i];
				}
			}(), j) || false;

		},

		/**
		 *  从JSON中抽取某一属性并返回该属性数组
		 * @param {Object} j JSON数据
		 * @param {Object} p 需要抽取的key
		 */
		extractArrayFromJsonArray: function(j, p) {
			var arr = [],
				args = arguments;
			return arguments.length > 2 && ((function() {

				for(x in j) {
					var jsons = {}; //对象引用的是地址，如果不重新新建的话会被修改数据
					for(i = 1; i < args.length; i++) {

						jsons[args[i]] = j[x][args[i]];

					}
					arr.push(jsons);
				}

			})(), arr) || ((function() {
				for(i in j) {
					arr.push(j[i][p]);
				}
			})(), arr)

		},

		/**
		 * 替换对象中具有特定值的某个属性为新值
		 * @param {Object} arr 需要更改的数组
		 * @param {Object} prop 需要替换的属性
		 * @param {Object} oldV 旧值
		 * @param {Object} newV 新值
		 */
		jsonArrayReplace: function(arr, prop, oldV, newV) {

			for(i in arr) {

				arr[i][prop] = arr[i][prop] == oldV ? newV : arr[i][prop];

			}
			return arr;
		},

		/**
		 * 
		 * 寻找索引，支持数组和JSON数组
		 * @param {Object} obj 寻找目标对象
		 * @param {String} val 寻找的值
		 * @param {String} condition JSON数组中寻找的属性
		 * ....
		 * 返回值所对应的下角标
		 */
		findIndex: function(obj, val, condition) {

			var index = [],
				args = arguments;
			!condition && $.each(obj, function(key, value) {
				value == val && index.push(key);
			}) || $.each(obj, function(key, value) {

				value[condition] == val && index.push(key);
			});

			return index.length > 0 && (index.length == 1 && index[0] || index) || null;
		},
		findString: function(Str, val) {
			return Str.indexOf(val) > -1 && true || false;

		},

		/**
		 * 自定义回调函数,通过条件 查找数组或者JSON数组索引
		 * @param {Object} obj
		 * @param {Object} callback[curVal,index] curVal当前元素，index为当前元素的索引，this为结果集数组
		 */
		findIndexWithCallback: function(obj, callback) {
			var res = [];
			obj.filter(callback, res);
			return res;
		},

		/**
		 * json数据拼接
		 * @param {Object} obj
		 * @param {Object} arr
		 * @param {Object} sep
		 */
		jsonStringJoin: function(obj, arr, sep) {
			var res = '';
			for(i in arr) {

				(i != arr.length - 1) && (res += eval('obj.' + arr[i]) + sep) || (res += eval('obj.' + arr[i]));

			}
			return res;

		},
		/**
		 * 非number类型按照unicode码排序，number类型则按大小排序，实际上是利用array的sort()函数，
		 * 默认unicode编码排序的方式，同样适用于ascii排序，一般用于签名排序
		 * @param {Object} obj 需要排序的对象：数组/JSON数组
		 * @param {Object} attr 如果obj为JSON数组，可以按照某个属性的值进行排序
		 */
		AsciiSort: function(obj, attribute) {
			attribute && obj.sort(function(a, b) {
				return(typeof a[attribute] == 'number' && typeof b[attribute] == 'number') && a[attribute] - b[attribute] ||
					a[attribute] > b[attribute];
			}) || obj.sort(function(a, b) {
				return(typeof a == 'number' && typeof b == 'number') && a - b || a > b;
			});
			return obj;
		},
		/**
		 * 将数字以金额形式展示，每三位一个逗号
		 * @param {Object} m
		 */
		money: function(m){
			var mStr = m.toString(),
				left = mStr.length % 3;
			var res = mStr.slice(0, left);
			left > 0 && mStr.length > 3 && (res += ',');
			for(var i = left; i < mStr.length; i += 3) {
				(i != mStr.length - 3) && (res += mStr.slice(i, i + 3) + ',') || (res += mStr.slice(i, i + 3));
			}
			return res || false;
		}
	},
	ui: {
		/**
		 * 轮播图片，
		 * <div id='x'><img/></img></div>  div 和img的position分别为relative和absolute
		 * @param {Object} id 轮播组件的id
		 * @param {Object} width 图片的宽度
		 * @param {Object} speed 轮播速度 单位毫秒
		 */
		banner: function(id, width, speed) {
			var list = [];
			var imgs = $('#' + id + ' img');
			$(imgs).each(function(i) {
				list.push(i * width);
				$(this).css({
					'left': list[i] + 'px'
				});
			});
			setInterval(function() {
				if($(imgs[$(imgs).length - 1]).css('left') != '0px') {
					$(imgs).each(function(i) {
						$(this).animate({
							'left': parseInt($(this).css('left').replace(/px/, '')) - width + 'px'
						});
					});
				} else {
					$(imgs).each(function(i) {
						$(this).animate({
							'left': list[i] + 'px'
						});
					});
				}
			}, speed);
		},
		circularMenu: function(id, radius, sp) /*radius中心圆和其他子菜单的的中心距离，part是四分之1圆的几等分,sp 起始位置，dc 顺时针还是逆时针*/ {
			var curRadius = 0; //最后一个所画子菜单相对于主菜单的中心角度
			var part = $('#menu .sub').length - 1;
			var averageRadius = (90 / part); //根据几等分来判断四分之一圆形的平均角度
			var subMenu = $('#menu .sub'); //获取所有子菜单
			var subCenter = $('#menu .center'); //主菜单
			//主菜单的中心X,Y坐标轴
			var subCenterX = $(subCenter).offset().left;
			var subCenterY = $(subCenter).offset().top;
			var menuList = []; //存储子菜单的位置属性
			var curX, curY; //中心圆与子菜单的绝对距离
			var turnX, turnY; //子菜单与中心园的相对方向
			switch(sp) {
				case 'left':
					turnX = -1;
					turnY = -1;
					break;
				case 'up':
					turnX = 1;
					turnY = -1;
					break;
				case 'right':
					turnX = 1;
					turnY = 1;
					break;
				case 'down':
					turnX = -1;
					turnY = 1;
					break;

			}

			for(i = 0; i < part + 1; i++) {
				curX = Math.cos(curRadius * Math.PI / 180) * radius * turnX;
				curY = Math.sin(curRadius * Math.PI / 180) * radius * turnY;
				menuList.push({
					x: curX,
					y: curY
				});
				curRadius += averageRadius;
				$('#menu .sub').eq(i).css({
					'left': (subCenterX + menuList[i].x),
					'top': (subCenterY + menuList[i].y)
				});
			}
			var num = 0,
				menuClickTime = 0;
			//展示动画
			function next(num) {
				var type;
				if(num < $('#menu .sub').length) {
					menuClickTime % 2 == 0 && (type = 1) || (type = 0);
					$('#menu .sub').eq(num).animate({
						opacity: type
					}, 300, function() {
						next(++num)
					});

				}
				if(num == part) {
					menuClickTime++;
				}

			}

			$(id).on('click', function() {
				next(num);
			});

		},
		showWaiting: function(id, number, spacing, radius) {

			var list = [];
			var canvas = $('#' + id)[0];
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = 'black';
			var w = $('#' + id).width(),
				h = $('#' + id).height();
			var startPosition = {
				x: w / 2 - (number - 1) * spacing / 2,
				y: h / 2
			}

			for(i = 0; i < number; i++) {

				list.push({
					x: startPosition.x + i * spacing,
					y: startPosition.y
				})
			}
			var curNumber = 0;

			function show() {
				if(curNumber < number) {
					ctx.beginPath();
					ctx.arc(list[curNumber].x, list[curNumber].y, radius, 0, 2 * Math.PI);
					ctx.fill();
					curNumber++;
				} else {
					ctx.clearRect(0, 0, w, h);
					curNumber = 0;
				}

				setTimeout(show, 320);

			}
			show();
		}

	},
	/**
	 * debug请求，主要是在调试过程中，请求后台失败(200以外的状态返回码)，能及时输出到控制台
	 */
	debug:function(){
		$(document).ajaxComplete(function(event, xhr, settings) {
	//日志格式:   请求状态【成功/失败】，请求的接口，发出请求的页面，返回的状态码，返回的内容，
	var status=xhr.status;//200
	if(status!=200)
	{
	var URL=event.target.URL;
	var readyState=xhr.readyState;//1,2,3,4
	var statusText=xhr.statusText;
	var responseText=xhr.responseText;
	var contentType=settings.contentType;
	var type=settings.type;
	var targetUrl=settings.url;
	var data=type.toUpperCase()=='POST'&&settings.data||'';	
	var log="【状态码】："+status+"  "+statusText+"【响应内容】"+responseText+" 【XMLHttpRequest 状态】 "+readyState+"  【请求内容类型 】"+contentType+" 【请求方式】："+type+"【请求数据】："+data+"【发起请求地址】"+URL+"【请求接口】"+targetUrl;
	console.log(log);
		
	}
});
		
		
	}
})

module.exports = $;