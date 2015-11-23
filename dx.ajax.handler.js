angular.module('dx.ajax.handler', [
    'ng',
])

.config(function($httpProvider, $provide) {

    $provide.value("dxAjaxHandlerStart", function(response) {
        // must be defined
    });

    $provide.value("dxAjaxHandlerStop", function(response) {
        // must be defined
    });

    $provide.factory("dxAjaxHandlerError", function($log) {
        return function(response) {
            $log.error('Http Error ' + response.status + " : " + response.data);
        }
    });

    $httpProvider.interceptors.push(function(dxAjaxHandlerError, $q) {
        return {
            responseError: function(response) {
                dxAjaxHandlerError(response);
                return $q.reject(response);
            }
        }
    });

    $httpProvider.interceptors.push(function(dxAjaxHandlerStart, dxAjaxHandlerStop, $q, $log) {
        var interceptor = {
            request: function(request) {
                if (interceptor.count == 0) {
                    dxAjaxHandlerStart();
                }
                interceptor.count++;
                return request;
            },
            requestError: function(request) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxAjaxHandlerStop();
                }
                return $q.reject(request);
            },
            response: function(response) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxAjaxHandlerStop();
                }
                return response;
            },
            responseError: function(response) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxAjaxHandlerStop();
                }
                return $q.reject(response);
            }
        }
        interceptor.count = 0;
        return interceptor;
    });

    $httpProvider.interceptors.push(function() {
        return {
            request: function(request) {

                var url = request.url;

                var isIE = !!window.ActiveXObject;

                if (isIE) {
                    url = url.replace('_nocache', '_nocache_' + new Date().getTime());
                }

                request.url = url;

                return request;

            }
        }
    });

    $httpProvider.defaults.timeout = 5000;

});