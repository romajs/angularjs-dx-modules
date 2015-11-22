dx-angularjs-modules
====================

## dx.ajax.handler

Http interceptor to handle ajax calls by the application, can be used to show and hide a loading modal for example.

### Configuration

Two functions must be overwritten:

#### dxAjaxHandlerStart

Loaded when **any** ajax call has started.

#### dxAjaxHandlerStop

Loaded when **all** ajax call has been sttoped.

## dx.format

Allows any declared filter into the application modules to be used as formatter directive, all AngularJS built-in **ngModel** are supported as well **ngModel** module.

Ex:

``
<input type="text" dx-format="number:2" />
``

### dxFormattersProvider

Allows application to create new formatters to be use together with the **dx-format** directive.

#### add

Ex:

``
dxFormattersProvider.add('foo', {
    format: function(value) {
        return value;
    },
    unformat: function(value) {
        return value;
    }
})
``

### Embedded filters

* percentage  

## dx.i18n

Internatinalization easy as never.

### Recipes

#### Directive (A)

``
<span>{{'app.greetings'|dxI18n}}</span>
``

#### Directive (E)

<span dx-i18n="app.greetings"></span>

#### Filter

``
<ul ng-repeat="item in items : dxI18n(item.type)">...</ul>
``

### Configuration

The resources bundle must be specified.

#### setResourcesBundle

Set the resources bundle for internatinalization

Ex:

``
var resourcesBundle = {
	'app.title': 'Title',
	'app.greetings': 'Hello world'
};

dxI18nProvider.setResourcesBundle(resourcesBunble);

``

## dx.growl.notifications

* TODO
