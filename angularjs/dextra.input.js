/**
 * PRECISA SER REVISADO!
 * @type @exp;angular@call;module
 */

var dxInput = angular.module('dextra.input', ['dextra.i18n', 'dextra.mask']);

dxInput.directive('dxDatepicker', function($timeout, $locale, $filter, dxI18n) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            maxDate: '='
        },
        link: function(scope, elm, attrs, ctrl) {
            var style = attrs.dxDatepicker ? attrs.dxDatepicker : 'medium';
            var maskName = 'date';
            var pattern = dxI18n.getPattern(style, maskName);
            var mask = pattern.replace(/[A-Za-z]/g, '9');
            elm.mask(mask);
            ctrl.$formatters.unshift(function(value) {
                value = !value ? pattern : dxI18n.formatDate(value, pattern);
                return value;
            });
            ctrl.$parsers.unshift(function(value) {
                var result = null;
                if (value) {
                    if (value.length == mask.length) {
                        try {
                            result = dxI18n.parseDate(value, pattern).getTime();
                        } catch (e) {
                            result = null;
                        }
                    }
                    ctrl.$setValidity(maskName, result != null);
                } else {
                    ctrl.$setValidity(maskName, true);
                }
                return result;
            });
            $timeout(function() {
                $(elm).val(attrs.placeholder).focus(function() {
                    if ($(this).val() === $(this).attr('placeholder')) {
                        $(this).val('');
                    }
                }).blur(function() {
                    if ($(this).val() === '') {
                        $(this).val(pattern);
                    }
                });
            });
            /*$timeout(function() {
             elm.datepicker({
             dateFormat : dxI18n.getJQueryFormat(pattern),
             onSelect : function(text) {
             if (text != null) {
             ctrl.$setViewValue(text);
             scope.$apply();
             }
             },
             maxDate : scope.maxDate
             });
             }, 0);*/
        }
    }
});

dxInput.directive('dxTimepicker', function($timeout, $locale, $filter, dxI18n) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            var style = attrs.dxTimepicker ? attrs.dxTimepicker : 'short';
            var maskName = 'time';
            var pattern = dxI18n.getPattern(style, maskName);
            var mask = pattern.replace(/[A-Za-z]/g, '9');
            elm.mask(mask);
            ctrl.$formatters.push(function(value) {
                if (value) {
                    var date = new Date(value);
                    value = date.getHours() + ":" + date.getMinutes();
                }
                return value;
            });
            ctrl.$parsers.push(function(value) {
                var result = null;
                if (value) {
                    if (value.length == mask.length) {
                        var array = value.split(':');
                        var hour = parseInt(array[0]);
                        var minute = parseInt(array[1]);
                        if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                            var date = new Date(0);
                            date.setHours(hour);
                            date.setMinutes(minute);
                            result = date.getTime();
                        }
                    }
                    ctrl.$setValidity(maskName, result != null);
                } else {
                    ctrl.$setValidity(maskName, true);
                }
                return result;
            });
        }
    }
});

dxInput.directive('dxMultiselect', function($timeout, $locale, $filter) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.multiselect({
                buttonClass: 'btn',
                buttonWidth: 'auto',
                maxHeight: attrs.maxHeight,
                includeSelectAllOption: true,
                selectAllText: 'Selecionar todos',
                selectAllValue: '',
                buttonContainer: '<div class="btn-group" />',
                buttonText: function(options) {
                    if (options.length == 0) {
                        return 'Nenhum selecionado <b class="caret"></b>';
                    } else if (options.length > 3) {
                        return options.length + ' selecionados  <b class="caret"></b>';
                    } else {
                        var selected = '';
                        options.each(function() {
                            selected += $(this).text() + ', ';
                        });
                        return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                    }
                }
            });
            if (scope[attrs.dxMultiselect]) {
                element.multiselect('dataprovider', $filter('orderBy')(scope[attrs.dxMultiselect], 'label'));
            }
            if (attrs.ngModel) {
                var prefixs = attrs.ngModel.split('.');
                var object = scope;
                for (var i = 0; i < prefixs.length; i++) {
                    var p = prefixs[i];
                    if (object) {
                        object = object[p];
                    } else {
                        break;
                    }
                }
                if (object) {
                    element.multiselect('select', object);
                }
            }
        }
    }
});

dxInput.directive('dxReadonly', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var result = scope.$eval(attr.dxReadonly);
            if (result) {
                element.find('select, input, textarea, button').attr('readonly', true).attr('disabled', true);
            }
        }
    };
})

dxInput.directive('dxFocus', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var expr = attrs.dxFocus ? attrs.dxFocus : 'true';
            var result = scope.$eval(expr);
            if (result) {
                $timeout(function() {
                    element.focus();
                }, 0);
            }
        }
    };
});

dxInput.directive('ieSelectFix', function($timeout) {
    return {
        require: 'select',
        link: function(scope, element) {
            var isIE = document.attachEvent;
            if (isIE) {
                $timeout(function() {
                    var index = element.prop('selectedIndex'), children = element.children().length;
                    scope.$watch(function() {
                        if (index !== element.prop('selectedIndex') || children !== element.children().length) {
                            index = element.prop('selectedIndex');
                            // var tmp = document.createElement('option');
                            var tmp = angular.element('<option></option>');
                            element.append(tmp);
                            tmp.remove();
                        }
                    })

                });
            }

        }
    }
});

dxInput.directive(
        'booleanSelect',
        function() {
            return {
                restrict: 'E',
                scope: {
                    value: '=',
                    trueLabel: '=',
                    falseLabel: '='
                },
                replace: true,
                template: '<select data-ng-model="value" required>'
                        + '<option data-ng-selected="value != false" value="true">{{trueLabel}}</option>'
                        + '<option data-ng-selected="value == false" value="false">{{falseLabel}}</option>'
                        + '</select>',
                link: function(scope, element, attrs) {
                    if (scope.value == undefined) {
                        scope.value = true;
                    }
                }
            };
        });

function isCommandKey(event) {
    return event.ctrlKey || [8, 9, 13, 17, 27, 35, 36, 37, 38, 39, 46].indexOf(event.which) >= 0;
}

function isNumericKey(event) {
    return (48 <= event.which && event.which <= 57) || (96 <= event.which && event.which <= 105);
}

function isSeparatorKey(event) {
    return event.which == 188 || event.which == 108 || event.which == 44;
}

//dxInput.directive('dxNumeric', function() {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elm, attrs, ctrl) {
//            ctrl.$formatters.push(function(value) {
//                if (value || value == 0) {
//                    return value.toString();
//                }
//            });
//            ctrl.$parsers.push(function(value) {
//                if (value) {
//                    return parseInt(value);
//                }
//            });
//            elm.bind('keydown', function(event) {
//                if (!isCommandKey(event) && !isNumericKey(event)) {
//                    event.preventDefault();
//                }
//            });
//            elm.bind('keyup', function(event) {
//                var valid = false;
//                if (isCommandKey(event) || isNumericKey(event)) {
//                    valid = true;
//                }
//                ctrl.$setValidity('numeric', valid);
//            });
//        }
//    }
//});

//dxInput.directive('dxCurrency', function() {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elm, attrs, ctrl) {
//            var maxlength = 20;
//            var separator = ',';
//            ctrl.$formatters.push(function(value) {
//                if (value || value == 0) {
//                    return value.toString().replace(".", separator);
//                }
//            });
//            ctrl.$parsers.push(function(value) {
//                if (value) {
//                    return parseFloat(value.replace(separator, "."));
//                }
//            });
//            elm.bind('keydown', function(event) {
//                var hasSeparator = event.target.value.indexOf(separator) >= 0;
//                var decimalSplit = event.target.value.split(separator);
//                var intPart = decimalSplit[0];
//                var decPart = decimalSplit[1] ? decimalSplit[1] : "";
//
//                if (isCommandKey(event)) {
//                    return;
//                } else if (event.target.value.length + 1 > maxlength) {
//                    event.preventDefault();
//                } else if (isSeparatorKey(event) && hasSeparator) {
//                    event.preventDefault();
//                } else if ((!isNumericKey(event) && !isSeparatorKey(event)) || decPart.length >= 2) {
//                    event.preventDefault();
//                }
//
//            });
//            elm.bind('keyup', function(event) {
//                var decimalSplit = event.target.value.split(separator);
//                var intPart = decimalSplit[0];
//                var decPart = decimalSplit[1] ? decimalSplit[1] : "";
//
//                var value = event.target.value.replace(separator, ".");
//                var number = value ? parseFloat(value) : 0;
//
//                var valid = number >= 0 && decPart.length <= 2;
//
//                ctrl.$setValidity('currency', valid);
//            });
//        }
//    };
//});

//dxInput.directive('dxPercentage', function() {
//    return {
//        restrict: 'A',
//        require: 'ngModel',
//        link: function(scope, elm, attrs, ctrl) {
//            var separator = ',';
//            ctrl.$formatters.push(function(value) {
//                if (value) {
//                    return value.toString().replace(".", separator);
//                }
//            });
//            ctrl.$parsers.push(function(value) {
//                if (value) {
//                    return parseFloat(value.replace(separator, "."));
//                }
//            });
//            elm.bind('keydown', function(event) {
//
//                var hasSeparator = event.target.value.indexOf(separator) >= 0;
//                var decimalSplit = event.target.value.split(separator);
//                var intPart = decimalSplit[0];
//                var decPart = decimalSplit[1] ? decimalSplit[1] : "";
//
//                if (isCommandKey(event)) {
//                    return;
//                } else if (isSeparatorKey(event) && hasSeparator) {
//                    event.preventDefault();
//                } else if ((!isNumericKey(event) && !isSeparatorKey(event)) || decPart.length >= 2) {
//                    event.preventDefault();
//                }
//
//            });
//            elm.bind('keyup', function(event) {
//
//                var decimalSplit = event.target.value.split(separator);
//                var intPart = decimalSplit[0];
//                var decPart = decimalSplit[1] ? decimalSplit[1] : "";
//
//                var value = event.target.value.replace(separator, ".");
//                var number = value ? parseFloat(value) : 0;
//
//                var valid = number <= 100 && number >= 0 && intPart.length <= 3 && decPart.length <= 2;
//
//                ctrl.$setValidity('persentage', valid);
//
//            });
//        }
//    };
//});