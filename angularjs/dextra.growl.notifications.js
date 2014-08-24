var app = angular.module('dextra.growl.notifications', ['ngAnimate']);

var GrownNotificationService = function(provider, dxI18n) {

    this.add = function(level, value) {

        if (typeof (value) === 'string') {
            value = [value];
        }

        for (var i in value) {
            provider.add(level, dxI18n(value[i]));
        }

    };

    this.error = function(value) {
        this.add('danger', value);
    };

    this.info = function(value) {
        this.add('info', value);
    };

    this.success = function(value) {
        this.add('success', value);
    };

    this.warn = function(value) {
        this.add('warning', value);
    };
};

var GrowlNotificationFactory = function(config, $timeout) {
    
    // TODO: transfer to controller

    var self = this;
    this.delay_ttl = config.delay_ttl;
    this.count = 0;
    this.messages = {};

    this.add = function(type, value) {

        this.registerAdd(type, value);
        this.incDelay();
    };

    this.push = function(message) {

        message.id = self.getId();
        message.remove = function() {
            // TODO:
        };
        return this.messages[message.id] = message;
    };

    this.getId = function() {

        var id = new Date().getTime();
        while (this.messages[id++] !== undefined)
            ;
        return id;
    };

    this.registerAdd = function(type, value) {

        $timeout(function() {

            var message = self.push({
                type: type,
                value: value,
            });

            self.registerRemove(message.id);

        }, this.delay_ttl);
    };

    this.registerRemove = function(id) {

        $timeout(function() {
            delete self.messages[id];
        }, config.fall_ttl);
    };

    this.incDelay = function() {
        this.delay_ttl += config.delay_ttl;
    };

    this.decDelay = function() {
        if (this.delay_ttl > 0) {
            this.delay_ttl -= config.delay_ttl;
        }
    };

};

app.directive('dxGrowlNotifications', function() {
    return {
        scope: {
            dismissible: '=',
            class: '@',
        },
        controller: ['$scope', 'dxGrowlProvider', function($scope, provider) {
                $scope.messages = provider.messages;

                $scope.$watchCollection('messages', function($new, $old) {
//                    console.info('value.length: ' + $new.length);
//                    console.info('value.length: ' + $old.length);
                    if ($new.length > $old.length) {
                        provider.decDelay();
                    }
                });
            }
        ],
        template: function() {
            var template = [];
            template.push('<div class="dx-growl alert {{\'alert-\' + message.type}} {{class}}"');
            template.push(' ng-repeat="message in messages" role="alert">');
            template.push('<button type="button" class="close" data-dismiss="alert"');
            template.push(' ng-if="dismissible" ng-click="message.remove()">');
            template.push('<span aria-hidden="true">&times;</span>');
            template.push('</button>');
            template.push('<span>{{message.value}}</span>');
            template.push('</div>');
            return template.join('\n');
        }
    };
});

app.provider('dxGrowlProvider', function() {

    var config = {
        delay_ttl: 180,
        fall_ttl: 5000,
    };

    this.$get = ['$timeout', 'dxI18n', function($timeout, dxI18n) {
            return new GrowlNotificationFactory(config, $timeout, dxI18n);
        }];
});

app.service('dxGrowl', ['dxGrowlProvider', 'dxI18n', GrownNotificationService]);