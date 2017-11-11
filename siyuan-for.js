var all = document.getElementsByTagName('*');
			$.each($(all), function(i) {

				if($(this).attr('siyuan-for')) {

					var newarr = $(this).attr('siyuan-for').split(' ');
					var newArray = [];
					eval("for(" + $(this).attr('siyuan-for') + "){newArray.push(" + newarr[2] + "[" + newarr[0] + "])}");
					if($(this).prop('tagName').toLowerCase() == 'ul') {
						var str = '';
						$.each(newArray, function(i) {
							str += '<li>' + newArray[i] + '</li>';
						});
						$(this).append(str);

					} else {

						var str = '';
						$.each(newArray, function(i) {
							str += '<li>' + newArray[i] + '</li>';
						});
						$(this).append('<ul>' + str + '</ul>');

					}

				}

			});