#!/bin/sh

if [ `git status -s|wc -l` -gt '0' ]; then
  echo 'commit changes first'
  exit 1
fi

case "$1" in
  major|x..)
    versionType=major;;

  minor|.x.)
    versionType=minor;;

  patch|..x)
    versionType=patch;;

  *)
    echo 'choose the version to deploy'
    echo 'deploy major|minor|patch|x..|.x.|..x'
    exit;;
esac

# test the code
npm run test || exit 1
# update package version
npm --no-git-tag-version version "$versionType"
git add package.json
version=`sed -n '/version/p' package.json|cut -d'"' -f4`
git commit -m "version $version"
git tag "$version"

npm publish
