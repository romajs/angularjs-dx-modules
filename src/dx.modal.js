angular.module('dx.modal' , [
	'dx.i18n', 'ui.bootstrap'
])
.provider('dxModal', function() {
	var config = {};
	this.controller = function(value) {
		config.controller = value;
	};
	this.templateUrl = function(value) {
		config.templateUrl = value;
	};
	this.$get = ['$modal', function($modal) {
		console.debug('dxModalProvider, config:', config);
    	return angular.extend({}, new dxModalService($modal, config));
	}];
})
.controller('dxModalController', function($scope, $modalInstance, content) {
	$scope.content = content;
	console.debug('content:', content);
	$scope.close = function() {
		$modalInstance.close();
	};
	$scope.buttonClick = function(button) {
		console.debug('buttonClick:', button);
		button.callback();
		$scope.close();
	};
})

function dxModalBuilder($modal, params) {

	console.debug('Modal', params);

	params.buttons = params.buttons || [];
	params.messages =  (typeof params.messages === 'string') ? [ params.messages ] : params.messages;

	this.addButton = function(id, caption, style, callback) {
		params.buttons.push({
			id: id,
			caption: caption,
			style: style,
			callback : function() {
				callback && callback();
			}
		});
		return this;
	};

	this.build = function() {
		var self = this;
		var modalInstance = $modal.open({
			// animation: true,
			backdrop : 'static',
			keyboard : false,
			controller: params.controller,
			resolve : {
				content : function() {
					return params;
				}
			},
			// size: size,
			templateUrl: params.templateUrl,
			windowClass : 'scrollable-modal modal ',
		});
		return modalInstance.result;
	};
}

function dxModalService($modal, config) {

	config.controller = config.controller || 'dxModalController';
	config.templateUrl = config.templateUrl || 'view/template/modal.html';

	this.show = function(type, title, messages, callback) {
		console.debug('show', type, title, messages, callback);
		var modal = new dxModalBuilder($modal, {
			buttons: [],
			controller: config.controller,
			templateUrl: config.templateUrl,
			messages: messages,
			title: title,
			type: type
		});
		modal.addButton('modalButtonOk', 'modal.button.ok', 'btn btn-primary', callback);
		return modal.build();
	};

	this.confirm = function(messages, yesCallback, noCallback) {
		console.debug('confirm', messages, yesCallback, noCallback);
		var modal = new dxModalBuilder($modal, {
			buttons: [],
			controller: config.controller,
			templateUrl: config.templateUrl,
			messages: messages,
			title: 'modal.title.confirm',
			type: 'info'
		});
		modal.addButton('modalButtonYes', 'modal.button.yes', 'btn btn-primary', yesCallback);
		modal.addButton('modalButtonNo', 'modal.button.no', 'btn btn-danger', noCallback);
		return modal.build();
	};

	this.error = function(messages, callback) {
		return this.show('danger', 'modal.title.error', messages, callback);
	};

	this.ok = function(messages, callback) {
		return this.show('success', 'modal.title.success', messages, callback);
	};

	this.warn = function(messages, callback) {
		return this.show('warning', 'modal.title.warning', messages, callback);
	};

}