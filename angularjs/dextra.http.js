/**
 * Este componente intercepta todas as requisições HTTP e fornece "2 callbacks"
 * para que sejam utilizadas pela aplicação: uma quando a requisição está ainda 
 * em andamento, e a outra quando todas as requisições terminara. Pode-se usar
 * isso para ativar um imagem de "loading" por exemplo.
 * @since 2014/08/17
 */
angular.module('dextra.http', ['ng']).config(function($httpProvider, $provide) {

    $provide.value("dxLoadingHideHandler", function(response) {
        // hide callback
    });
    $provide.value("dxLoadingShowHandler", function(response) {
        // show callback
    });

    $provide.factory("dxErrorHandler", function($log) {
        return function(response) {
            $log.error('Http Error ' + response.status + " : " + response.data);
        }
    });

    $httpProvider.interceptors.push(function(dxErrorHandler, $q) {
        return {
            responseError: function(response) {
                dxErrorHandler(response);
                return $q.reject(response);
            }
        }
    });

    $httpProvider.interceptors.push(function(dxLoadingShowHandler, dxLoadingHideHandler, $q, $log) {
        var interceptor = {
            request: function(request) {
                if (interceptor.count == 0) {
                    dxLoadingShowHandler();
                }
                interceptor.count++;
                return request;
            },
            requestError: function(request) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxLoadingHideHandler();
                }
                return $q.reject(request);
            },
            response: function(response) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxLoadingHideHandler();
                }
                return response;
            },
            responseError: function(response) {
                interceptor.count--;
                if (interceptor.count == 0) {
                    dxLoadingHideHandler();
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