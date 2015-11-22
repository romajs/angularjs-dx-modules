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

```html
<input type="text" dx-format="number:2" />
```

### dxFormattersProvider

Allows application to create new formatters to be use together with the **dx-format** directive.

#### add

Ex:

```js
dxFormattersProvider.add('foo', {
    format: function(value) {
        return value;
    },
    unformat: function(value) {
        return value;
    }
})
```

### Embedded filters

* percentage  

## dx.i18n

Internatinalization easy as never.

### Recipes

#### Directive (A)

```html
<span>{{'app.greetings'|dxI18n}}</span>
```

#### Directive (E)

```html
<span dx-i18n="app.greetings"></span>
```

#### Filter

```html
<ul ng-repeat="item in items : dxI18n(item.type)">...</ul>
```

### Configuration

The resources bundle must be specified.

#### setResourcesBundle

Set the resources bundle for internatinalization

Ex:

```js
var resourcesBundle = {
	'app.title': 'Title',
	'app.greetings': 'Hello world'
};

dxI18nProvider.setResourcesBundle(resourcesBundle);
```

## dx.growl.notifications

* TODO
