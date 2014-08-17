var app = angular.module('dextra.resources', ['ngLocale']);

/// ???
app.run(['$rootScope', 'dxI18n', function($rootScope, i18n) {
        $rootScope.i18n = i18n.getMessage;
    }]);

/**
 * Img
 */

// Img: {{ expression | dxImg }}
app.filter('dxImg', ['dxResourcesBundle', function(resourcesBundle) {
        return function(input) {
            return input ? resourcesBundle.img[input] : input;
        };
    }
]);

/**
 * I18n
 */

// I18n: {{ expression | dxI18n }}
app.filter('dxI18n', ['dxI18n', function(i18n) {
        return function(input, var1, var2, var3, var4, var5) {
            return i18n.getMessage(input, var1, var2, var3, var4, var5);
        };
    }]);

// I18n: <elem dx-I18n="expression">
app.directive('dxI18n', ['dxI18n', function(i18n) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs, ctrl) {
                elm.html(i18n.getMessage(attrs.dxI18n));
            }
        };
    }]);

// I18n: <dx-I18n>expression</dx-I18n>
app.directive('dxI18n', ['dxI18n', function(i18n) {
        return {
            restrict: 'E',
            link: function(scope, elm, attrs, ctrl) {
                elm.html(i18n.getMessage(elm.html()));
            }
        };
    }]);

app.factory("dxI18n", ['dxResourcesBundle', '$locale', function(resourcesBundle, $locale) {

        var result = function(key) {

            var object = resourcesBundle.i18n[key];

            var result = object && object != '' ? object : key;

            for (var i = 1; i < arguments.length; i++) {
                var index = i - 1;
                result = result.replace(new RegExp('\\{' + index + '\\}', 'gm'), arguments[i]);
            }

            return result;

        };

        result.getMessage = result;

        result.getPattern = function(style, type) {
            var t = '';
            if (type) {
                t = type.charAt(0).toUpperCase() + type.slice(1);
            }
            var property = style + '' + t;
            return $locale.DATETIME_FORMATS[property];
        };

        result.getJQueryFormat = function(pattern) {
            return convertToJQueryDateFormat(pattern);
        };

        result.formatDate = function(value, pattern) {
            var format = this.getJQueryFormat(pattern);
            return $.datepicker.formatDate(format, new Date(value));
        };

        result.parseDate = function(value, pattern) {
            var format = this.getJQueryFormat(pattern);
            return $.datepicker.parseDate(format, value);
        };

        result.formatTime = function(value, pattern) {
            var format = this.getJQueryFormat(pattern);
            return $.datepicker.formatDate(format, new Date(value));
        };

        result.parseTime = function(value, pattern) {
            var format = this.getJQueryFormat(pattern);
            return $.datepicker.parseDate(format, value);
        };

        return result;

    }]);

function convertToJQueryDateFormat(pattern) {

    // Year
    if (pattern.search(/y{3,}/g) >= 0) { /* YYYY */
        pattern = pattern.replace(/y{3,}/g, "yy");
    } else if (pattern.search(/y{2}/g) >= 0) { /* YY */
        pattern = pattern.replace(/y{2}/g, "y");
    }

    // Month
    if (pattern.search(/M{4,}/g) >= 0) { /* MMMM */
        pattern = pattern.replace(/M{4,}/g, "MM");
    } else if (pattern.search(/M{3}/g) >= 0) { /* MMM */
        pattern = pattern.replace(/M{3}/g, "M");
    } else if (pattern.search(/M{2}/g) >= 0) { /* MM */
        pattern = pattern.replace(/M{2}/g, "mm");
    } else if (pattern.search(/M{1}/g) >= 0) { /* M */
        pattern = pattern.replace(/M{1}/g, "m");
    }

    // Day
    if (pattern.search(/D{2,}/g) >= 0) { /* DD */
        pattern = pattern.replace(/D{2,}/g, "oo");
    } else if (pattern.search(/D{1}/g) >= 0) { /* D */
        pattern = pattern.replace(/D{1}/g, "o");
    }

    // Day of month
    if (pattern.search(/E{4,}/g) >= 0) { /* EEEE */
        pattern = pattern.replace(/E{4,}/g, "DD");
    } else if (pattern.search(/E{2,3}/g) >= 0) { /* EEE */
        pattern = pattern.replace(/E{2,3}/g, "D");
    }

    return pattern;

};