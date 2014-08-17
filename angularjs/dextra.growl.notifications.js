var app = angular.module('dextra.growl.notifications', ['ngAnimate']);

app.service('dxGrowl', function($rootScope, $timeout, dxI18n) {

    if (!$rootScope.dxGrowl) {
        $rootScope.dxGrowl = {
            count: 0,
            show_ttl: 300,
            remove_ttl: 10000,
            messages: [],
            queue: [],
            addQueue: function(level, value) {
                return this.queue.push({
                    id: this.count++,
                    level: level,
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
    }

    return {
        add: function(level, value) {
            if (typeof (value) === 'string') {
                value = [value];
            }
            for (var i in value) {
                $rootScope.dxGrowl.addQueue(level, value[i]);
            }
            if ($rootScope.dxGrowl.queue && $rootScope.dxGrowl.queue.length > 0) {
                $rootScope.dxGrowl.unQueue(0);
            }
        },
        info: function(value) {
            this.add('info', value);
        },
        warn: function(value) {
            this.add('warning', value);
        },
        error: function(value) {
            this.add('danger', value);
        },
        success: function(value) {
            this.add('success', value);
        },
        remove: function(id) {
            delete $rootScope.messages[id];
        },
        getMessages: function() {
            return $rootScope.messages;
        }
    };

});