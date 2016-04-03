subtree
=======

**How-to use this project with git subtree:**

1 - Create a git subtree into your project as follow:
```shell
git subtree add --prefix=src/main/webapp/lib/angularjs-dx-modules git@github.com:romajs/angularjs-dx-modules.git master --squash
```

2 - Any change from this project can be updated into your project:
```shell
git subtree pull --prefix=src/main/webapp/lib/angularjs-dx-modules git@github.com:romajs/angularjs-dx-modules.git master --squash
```

3 - Also you can push any modification from your project inside the subtree:
```shell
git subtree push --prefix=src/main/webapp/lib/angularjs-dx-modules git@github.com:romajs/angularjs-dx-modules.git master --squash
```
*PS: only if you have push permission, of course!*
