angular.module('dx.i18n' , [
    'ngLocale'
])

.directive('dxI18n', ['dxI18n', function(i18n) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs, ctrl) {
            elm.html(i18n.getMessage(attrs.dxI18n));
        }
    };
}])

.directive('dxI18n', ['dxI18n', function(i18n) {
    return {
        restrict: 'E',
        link: function(scope, elm, attrs, ctrl) {
            elm.html(i18n.getMessage(elm.html()));
        }
    };
}])

.filter('dxI18n', ['dxI18n', function(i18n) {
    return function(input, var1, var2, var3, var4, var5) {
        return i18n.getMessage(input, var1, var2, var3, var4, var5);
    };
}])

.provider("dxI18n", function() {

    var dxI18n = new function() {

        this.lang = null;
        this.languages = {};

        this.add = function(lang, json) {
            this.languages[lang] = json;
        };

        this.set = function(lang, json) {
            json && this.add(lang, json);
            this.lang = lang;
        };

        this.getMessage = function(key) {
            var object = this.languages[this.lang][key];
            var result = object && object != '' ? object : key;
            // console.info(key, object, result);
            if(result) {
                    for (var i = 1; i < arguments.length; i++) {
                    var index = i - 1;
                    result = result.replace(new RegExp('\\{' + index + '\\}', 'gm'), arguments[i]);
                }
            }
            return result;
        };

    };

    this.add = function(key, json) {
        dxI18n.add(key, json);
    };

    this.set = function(key, json) {
        dxI18n.set(key, json);
    };

    this.$get = [function() {
        return dxI18n;
    }];

})
