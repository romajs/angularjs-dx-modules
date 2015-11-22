angular.module('dx.format', [
  'ngModel',
])

.provide('dxFormatters', function() {
    
    var formatters = [];

    this.add = function(name, formatter) {
        if (this[name] !== undefined) {
            console.error('formatter ' + name + ' already exists!');
        } else {
            formatters[name] = formatter;
        }
    };

    this.add('default', {
        format: function(value) {
            return value;
        },
        unformat: function(value) {
            return value;
        }-
    });

    this.add('percentage', { // filter is below
        format: function(value) {
            return parseFloat(value) ? value * 100 : '';
        },
        unformat: function(value) {
            return parseFloat(value) ? value / 100 : '';
        }
    });

    this.$get = [ function() {
        return formatters;
    }];

})

.directive('dxFormat', ['$filter', 'dxFormatters', function($filter, formatters) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {

            var dxFormat = attrs.dxFormat;
            var splitPos = dxFormat.indexOf(':');

            var filterName = dxFormat.substr(0, splitPos);
            var params = dxFormat.substr(splitPos + 1, dxFormat.length);

            var formatter = formatters[filterName] || formatters.default;

            var filter = function(value) {
                return $filter(filterName)(formatter.format(value), params);
            };

            var value;

            elem.bind('blur', function() {
                if (value && elem.val() !== '') {
                    elem.val(filter(value));
                } else {
                    elem.val('');
                    delete value;
                }
            });

            elem.bind('focus', function() {
                elem.val(filter(value));
            });

            ctrl.$formatters.unshift(function(modelValue) {
                value = modelValue;
                return filter(value);
            });

            ctrl.$parsers.unshift(function(viewValue) {
                var result;
                if (filter(viewValue)) {
                    value = formatter.unformat(viewValue);
                } else {
                    value = undefined;
                }
                result = value;
                return result;
            });
        }
    };
}])

.filter('percentage', ['$filter', function($filter) {
    return function(value, digits) {
        return $filter('number')(value, digits) + ' %';
    };
}])