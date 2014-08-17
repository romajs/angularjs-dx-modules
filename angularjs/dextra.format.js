var app = angular.module('dextra.format', []);

/**
 * Este componente age junto com a diretiva "ngModel" aplicando qualquer filtro
 * declarado na aplicação, todos os filtros padrões do angular são suportados.
 * Caso tenha algum filtro onde um comportamento específico seja necessário é
 * preciso adicioná-lo a constante "dxCustomFormatters" (ver exemplo em app.run)
 * Importante: Note que não podem haver formatadores repetidos!
 * @since 2014/08/17
 * @author: @romajs
 */
app.directive('dxFormat', ['$filter', 'dxCustomFormatters', function($filter, formatters) {
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
                    elem.val($filter(filterName)(formatter.format(value, params)));
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
    }]);

app.constant('dxCustomFormatters', {
    // cada formatador precisa ter seus métodos "format" e "unformat", ex:
    default: {
        format: function(value) {
            return value;
        },
        unformat: function(value) {
            return value;
        }
    },
    add: function(name, formatter) {
        if (this[name] !== undefined) {
            console.error('dxCustomFormats: formatter ' + name + ' already exists!');
        } else {
            this[name] = formatter;
        }
    }
});

app.filter('percentage', ['$filter', function($filter) {
        return function(value, digits) {
            return $filter('number')(value, digits) + ' %';
        };
    }
]);

app.run(['dxCustomFormatters', function(formatters) {
        formatters.add('percentage', {
            format: function(value) {
                return parseFloat(value) ? value * 100 : '';
            },
            unformat: function(value) {
                return parseFloat(value) ? value / 100 : '';
            }
        });
    }
]);
