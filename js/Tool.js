$.fn.extend({
			/**
			 * @param {Object} 表单以外的额外数据
			 */
			formTojson: function(newObj) {
				$t = $(this);
				var obj = {};
				$.each($($t).serializeArray(), function(i, _obj) {
						obj[_obj.name] = _obj.value;
				});
				return $.extend(true, obj , newObj);
			}
		})


