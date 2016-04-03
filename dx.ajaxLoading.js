/*
 * dx.ajaxLoading
 * 
 * HOW TO:
 * 
 * 1. Add module dependency to application modules:
 * 
 * angular.module('app', [..., 'dx.ajaxLoading', ...])...
 * 
 * 2. Add interceptor to application configuration: 
 * 
 * .config(function ($httpProvider) {
 *     $httpProvider.interceptors.push('dxAjaxLoadingInterceptor');
 * })
 * 
 * 3. Use the directive attribute in html elements:
 *
 * <div id="loading" class="loading" dx-ajax-loading>...</div>
 * 
 */

angular.module('dx.ajaxLoading', [
    //
])

.directive('dxAjaxLoading', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope : {
            onStart : '&',
            onStop : '&',
            display : '=dxAjaxLoading'
        },
        link : function($scope, $element, $attr) {
            $rootScope.$on('dxAjaxLoading.START', function(value) {
                $scope.display = true;
                $scope.onStart && $scope.onStart($scope.display, value);
                $element.show();
            });
            $rootScope.$on('dxAjaxLoading.STOP', function(value) {
                $scope.display = false;
                $scope.onStop && $scope.onStop($scope.display, value);
                $element.hide();
            });
        }
    };
}])

.factory('dxAjaxLoadingInterceptor', ['$q', 'dxAjaxLoadingService', function($q, dxAjaxLoadingService) {
    return {
        request: function(request) {
            dxAjaxLoadingService.count.inc();
            return request;
        },
        requestError: function(request) {
            dxAjaxLoadingService.count.dec();
            return $q.reject(request);
        },
        response: function(response) {
            dxAjaxLoadingService.count.dec();
            return response;
        },
        responseError: function(response) {
            dxAjaxLoadingService.count.dec();
            return $q.reject(response);
        }
    };
}])

.service('dxAjaxLoadingService', ['$rootScope', function($rootScope) {
    this.count = {
        value : 0,
        dec: function() {
            handle(--this.value);
        },
        inc : function() {
            handle(++this.value);
        },
    };
    function handle(value) {
        value = value < 0 ? 0 : value;
        if(value === 1) {
            return $rootScope.$emit('dxAjaxLoading.START', value);
        } else if(value === 0) {
            return $rootScope.$emit('dxAjaxLoading.STOP', value);
        }
    };
}])