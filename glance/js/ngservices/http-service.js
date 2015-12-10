function glanceHttp($http, $state, $rootScope, utils, Notification) {
    var token;
    var clearCallback;
    
    if (!$rootScope.loadings) {
        $rootScope.loadings = {};
    }
    
    var init = function (thetoken, theclearCallback) {
        token = thetoken;
        clearCallback = theclearCallback;
    };
    
    function startLoading(loading) {
        if (loading) {
            if (!$rootScope.loadings[loading]) {
                $rootScope.loadings[loading] = 1;
            } else {
                $rootScope.loadings[loading] += 1;
            }
        }
    }
    
    function stopLoading(loading) {
        if (loading) {
            $rootScope.loadings[loading] -= 1;
        }
    }

    var ajaxBase = function (method, url, data, params, callback, errorCallback, warningCallback, loading) {
        var fullURL;
        if (angular.isArray(url)) {
            fullURL = utils.buildFullURL(url[0], url[1]);
        } else {
            fullURL = utils.buildFullURL(url);
        }
        var headers = {
            'Content-Type': 'application/json; charset=UTF-8'
        };
        headers["Authorization"] = token;
        var req = {
            method: method,
            url: fullURL,
            headers: headers,
            cache: false,
            data: data,
            params: params
        };

        if (loading == undefined) {
            loading = "default";
        }
        startLoading(loading);
        
        return $http(req).success(function (data) {
            stopLoading(loading);
            if (data && (data.code == undefined || data.code === MESSAGE_CODE.success)) {
                if(callback) {
                    callback(data);
                }
            } else if (warningCallback) {
                warningCallback(data);
            } else {
                Notification.error("服务未激活");
            }
        }).error(function (data, status) {
            stopLoading(loading);
            if (status == 401) {
                window.location.href = USER_URL;
                $rootScope.$destroy();
            } else if (status == 403) {
                Notification.error("您没有权限进行此操作");
            }else if(errorCallback){
                errorCallback(data, status);
            } else {
                console.log("request failed (" + status + ")");
                Notification.error("服务未激活");
            }
        });

    };

    var ajaxGet = function (url, callback, params, errorCallback, warningCallback, loading) {
       return ajaxBase("get", url, null, params, callback, errorCallback, warningCallback, loading);
    };
    
    var ajaxDelete = function (url, callback, data, params, errorCallback, warningCallback, loading) {
        ajaxBase("delete", url, data, params, callback, errorCallback, warningCallback, loading);
    };

    var ajaxPost = function (url, data, callback, params, errorCallback, warningCallback, loading) {
        ajaxBase("post", url, data, params, callback, errorCallback, warningCallback, loading);
    };
    
    var ajaxFormPost = function(myScope, url, callback, errorCallback, loading) {
        ajaxFormSubmit("post", myScope, url, callback, errorCallback, loading);
    };
    
    var ajaxPut = function (url, data, callback, params, errorCallback, warningCallback, loading) {
        ajaxBase("put", url, data, params, callback, errorCallback, warningCallback, loading);
    };
    
    var ajaxFormSubmit = function(method, myScope, url, callback, errorCallback, loading) {
        myScope.staticForm.$setPristine();
        myScope.message_error_info = {};
        ajaxBase(method, url, myScope.form, undefined, callback, function(data, status){
            if(data && data.code === MESSAGE_CODE.dataInvalid) {
                myScope.message_error_info = data.errors;
            } else if (errorCallback) {
                errorCallback(data, status);
            }
        }, undefined, loading);
    }
    
    var ajaxFormPut = function(myScope, url, callback, errorCallback, loading) {
        ajaxFormSubmit("put", myScope, url, callback, errorCallback, loading);
    };
    
    return {
        init: init,
        ajaxBase: ajaxBase,
        ajaxPost: ajaxPost,
        ajaxPut: ajaxPut,
        ajaxGet: ajaxGet,
        ajaxFormPost: ajaxFormPost,
        ajaxFormPut: ajaxFormPut,
        ajaxDelete: ajaxDelete
    };
}

glanceHttp.$inject = ["$http", "$state", "$rootScope", "utils", "Notification"];
glanceApp.factory('glanceHttp', glanceHttp);
