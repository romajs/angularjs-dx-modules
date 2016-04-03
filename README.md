dx-angularjs-modules
====================

Common utility modules used by most Angular applications but not provided by AngularJS, yet!

**How-to use this project with git subtree:**

1 - Create a git subtree into your project as follow:
```shell
git subtree add --prefix=src/main/webapp/js/modules/dx-angularjs-modules git@github.com:romajs/dx-angularjs-modules.git master --squash
```

2 - Any change from this project can be updated into your project:
```shell
git subtree pull --prefix=src/main/webapp/js/modules/dx-angularjs-modules git@github.com:romajs/dx-angularjs-modules.git master
```

3 - Also you can push any modification from your project inside the subtree:
```shell
git subtree push --prefix=src/main/webapp/js/modules/dx-angularjs-modules git@github.com:romajs/dx-angularjs-modules.git master
```
*PS: only if you have push permission, of course!*

# Modules

Name                 | Status | Description
---------------------|--------|------------
dx.ajaxLoading       | OK     | Ajax loading auto display with HTTP interceptor and directive
dx.format            | ?      | 
dx.i18n              | ?      |
dx.growlNotification | ?      |
dx.modal             | ?      |