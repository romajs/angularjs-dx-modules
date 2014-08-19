var app = angular.module('dextra.growl.notifications', ['ngAnimate']);

//app.run(function($rootScope) {
//    $rootScope.$watch('dxGrowl.queue', function(value) {
//        console.info(value)
//    });
//});

app.controller('dxGrowlNotificationsCtrl', ['$scope', 'dxGrowlNotifications', function($scope, dxGrowlNotifications) {
        $scope.messages = dxGrowlNotifications.messages;
    }
]);

app.factory('dxGrowlNotifications', function($timeout, dxI18n) {
    return {
        count: 0,
        show_ttl: 300,
        remove_ttl: 10000,
        messages: [],
        queue: [],
        addQueue: function(type, value) {
            return this.queue.push({
                id: this.count++,
                type: type,
                value: dxI18n(value)
            });
        },
        unQueue: function(index) {
            this.addMessage(this.queue[index]);
            this.queue.splice(index, 1);
            if (this.queue.length > 0) {
                var self = this;
                $timeout(function() {
                    self.unQueue(0);
                }, this.show_ttl);
            }
        },
        addMessage: function(obj) {
            this.messages.push(obj);
            var self = this;
            $timeout(function() {
                self.messages.splice(0, 1);
            }, this.remove_ttl);
        }
    };
});

app.directive('dxGrowlNotifications', function() {
    return {
        scope: {
            dismissible: '=',
            class: '@',
        },
        template: function() {
            var template = [];
            template.push('<div data-ng-controller="dxGrowlNotificationsCtrl">');
            template.push('<div class="dx-growl alert {{\'alert-\' + message.type}} {{class}}"');
            template.push(' ng-repeat="message in messages" role="alert">');
            template.push('<button type="button" class="close" data-dismiss="alert" ng-if="dismissible">');
            template.push('<span aria-hidden="true">&times;</span>');
            template.push('</button>');
            template.push('<span>{{message.value}}</span>');
            template.push('</div>');
            template.push('</div>');
            return template.join('\n');
        }
    };
});

app.service('dxGrowl', function(dxGrowlNotifications) {

    return {
        add: function(level, value) {
            if (typeof (value) === 'string') {
                value = [value];
            }
            for (var i in value) {
                dxGrowlNotifications.addQueue(level, value[i]);
            }
            if (dxGrowlNotifications.queue && dxGrowlNotifications.queue.length > 0) {
                dxGrowlNotifications.unQueue(0);
            }
        },
        error: function(value) {
            this.add('danger', value);
        },
        info: function(value) {
            this.add('info', value);
        },
        success: function(value) {
            this.add('success', value);
        },
        warn: function(value) {
            this.add('warning', value);
        }
    };

});