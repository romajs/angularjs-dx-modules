var app = angular.module('dextra.growl.notifications', ['ngAnimate']);

var dxGrowlFactory = function(config, $timeout, dxI18n) {

    var self = this;
    this.count = 0;
    this.messages = [];
    this.queue = [];

    this.addQueue = function(type, value) {
        return this.queue.push({
            id: this.count++,
            type: type,
            value: dxI18n(value)
        });
    };

    this.unQueue = function(index) {
        this.addMessage(this.queue[index]);
        this.queue.splice(index, 1);
        if (this.queue.length > 0) {
            $timeout(function() {
                self.unQueue(0);
            }, config.show_ttl);
        }
    };

    this.addMessage = function(obj) {
        this.messages.push(obj);
        $timeout(function() {
            self.messages.splice(0, 1);
        }, config.remove_ttl);
    };
};

var dxGrowService = function(provider) {
    
    this.add = function(level, value) {
        if (typeof (value) === 'string') {
            value = [value];
        }
        for (var i in value) {
            provider.addQueue(level, value[i]);
        }
        if (provider.queue && provider.queue.length > 0) {
            provider.unQueue(0);
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

app.provider('dxGrowlProvider', function() {

    var config = {
        show_ttl: 300,
        remove_ttl: 10000,
    };

    this.$get = ['$timeout', 'dxI18n', function($timeout, dxI18n) {
            return new dxGrowlFactory(config, $timeout, dxI18n);
        }];
});

app.service('dxGrowl', ['dxGrowlProvider', dxGrowService]);

app.directive('dxGrowlNotifications', function() {
    return {
        scope: {
            dismissible: '=',
            class: '@',
        },
        controller: ['$scope', 'dxGrowlProvider', function($scope, provider) {
                $scope.messages = provider.messages;
            }
        ],
        template: function() {
            var template = [];
            template.push('<div class="dx-growl alert {{\'alert-\' + message.type}} {{class}}"');
            template.push(' ng-repeat="message in messages" role="alert">');
            template.push('<button type="button" class="close" data-dismiss="alert" ng-if="dismissible">');
            template.push('<span aria-hidden="true">&times;</span>');
            template.push('</button>');
            template.push('<span>{{message.value}}</span>');
            template.push('</div>');
            return template.join('\n');
        }
    };
});
