#!/bin/bash -xe

CURRENT_DIR="$(dirname $(readlink -f $0))/"
GIT_REPO_URL="$(git --git-dir=$DIR.git config --get remote.origin.url)"
git subtree pull --prefix=$CURRENT_DIR git@$GIT_REPO_URL master --squash