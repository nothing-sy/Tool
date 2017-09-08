$.fn.extend({
			
				/**
				 * @param {Object} join 遇到相同的参数是否合并，合并用逗号隔开
				 * @param {Object} newObj 表单外的参数
				 */
				formTojson: function(join,newObj) {
					arguments[0]===undefined?false:true;
					$t = $(this);
					var obj = {};
					$.each($($t).serializeArray(), function(i, _obj) {

						if(obj.hasOwnProperty(_obj.name) && join) //如果已经存在，则根据条件选择是去除还是拼接在后面
						{
							obj[_obj.name]+= ','+_obj.value;	
						} else {
							obj[_obj.name] = _obj.value;
						}
					});
					return $.extend(true, obj, newObj);
				}

		
		})


