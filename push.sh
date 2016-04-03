#!/bin/bash -xe

CURRENT_DIR="$(dirname $(readlink -f $0))/"
GIT_REPO_URL="git@github.com:romajs/angularjs-dx-modules.git" #"$(git --git-dir=$DIR.git config --get remote.origin.url)"
git subtree push --prefix=$CURRENT_DIR git@$GIT_REPO_URL master --squash