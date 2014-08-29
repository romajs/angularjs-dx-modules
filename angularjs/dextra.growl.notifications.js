var app = angular.module('dextra.growl.notifications', ['ngAnimate']);

app.directive('dxGrowlNotifications', function() {
    return {
        scope: {
            dismissible: '=',
            class: '@',
        },
        controller: ['$scope', 'dxGrowlNotificationSession', function($scope, session) {
                $scope.messages = session.messages;

                $scope.$watchCollection('messages', function($new, $old) {
//                    console.info('value.length: ' + $new.length);
//                    console.info('value.length: ' + $old.length);
                    session.decDelay();
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

app.service('dxGrowlNotificationSession', function($timeout) {

    // TODO: transfer to controller

    var config = {
        delay_ttl: 50,
        fall_ttl: 10000
    };

    var self = this;
    this.delay_ttl = config.delay_ttl;
    this.fall_ttl = config.fall_ttl;
    this.count = 0;
    this.messages = {};

    this.add = function(type, value) {

//        console.info('this.delay_ttl: ' + this.delay_ttl);
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
        while (this.messages[id] !== undefined) {
            id++;
        }
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

});

app.service('dxGrowlNotificationService', ['dxGrowlNotificationSession', 'dxI18n', function(session, dxI18n) {

        this.add = function(level, value) {

            if (typeof (value) === 'string') {
                value = [value];
            }

            for (var i in value) {
                session.add(level, dxI18n(value[i]));
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
    }

]);