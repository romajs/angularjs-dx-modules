/**
 * PRECISA SER REVISADO!
 * @type @exp;angular@call;module
 */
angular.module('dextra.mask', []).factory('dxMaskDefinitions', function() {
	return {
		cpf : '999.999.999-99',
		cnpj : '99.999.999/9999-99',
		cep : '99999-999',
		phone : '(99) 9999-9999?9',
		time : '99:99',
		birthday : '99/99',
	}
}).factory('dxMasker', function() {
	return {
		apply : function(elm, ctrl, maskName, mask, formatter) {
			elm.mask(mask);
			ctrl.$formatters.push(function(value) {
				return !value ? value : formatter(value);
			});
			ctrl.$parsers.push(function(value) {
				var result = null;
				if (value) {
					try {
						result = parseInt(value.replace(/[^\d]/gi, '').replace(/^0+/gi,''));
					} catch (e) {
						result = null;
					}
					ctrl.$setValidity(maskName, result != null);
				} else {
					ctrl.$setValidity(maskName, true);
				}
				return result;
			});
		}
	};
}).filter('mask', function() {
	return function(value, mask) {

		if (value) {

			var input = value + '';
			input = input.replace(/\D/g, "");

			var text = '';
			var j = 0;

			for ( var i = 0; i < mask.length; i++) {
				var maskCaracter = mask.charAt(i);
				if (maskCaracter == '0' || maskCaracter == '9') {
					text += input.charAt(j++);
					if (input.length == j) {
						break;
					}
				} else {
					text += maskCaracter;
				}
			}

			value = text;

		}

		return value;

	};
}).filter('cpf', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['cpf']);
	};
}).filter('birthday', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['birthday']);
	};
}).filter('cnpj', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['cnpj']);
	};
}).filter('cep', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['cep']);
	};
}).filter('phone', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['phone']);
	};
}).filter('time', function($filter, dxMaskDefinitions) {
	return function(text) {
		return $filter('mask')(text, dxMaskDefinitions['time']);
	};
}).directive('dxMask', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var definition = dxMaskDefinitions[attrs.dxMask];
			var mask = definition ? definition : attrs.dxMask;
			dxMasker.apply(elm, ctrl, 'mask', mask, function(value) {
				return value;
			});
		}
	};
}).directive('dxCpf', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'cpf';
			dxMasker.apply(elm, ctrl, maskName, dxMaskDefinitions[maskName], $filter(maskName));
		}
	};
}).directive('dxBirthday', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'birthday';
			dxMasker.apply(elm, ctrl, maskName, dxMaskDefinitions[maskName], $filter(maskName));
		}
	};
}).directive('dxCnpj', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'cnpj';
			dxMasker.apply(elm, ctrl, maskName, dxMaskDefinitions[maskName], $filter(maskName));
		}
	};
}).directive('dxCep', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'cep';
			dxMasker.apply(elm, ctrl, maskName, dxMaskDefinitions[maskName], $filter(maskName));
		}
	};
}).directive('dxPhone', function($filter, dxMaskDefinitions, dxMasker) {
	return {
		restrict : 'A',
		require : 'ngModel',
		link : function(scope, elm, attrs, ctrl) {
			var maskName = 'phone';
			dxMasker.apply(elm, ctrl, maskName, dxMaskDefinitions[maskName], $filter(maskName));
		}
	};
});
