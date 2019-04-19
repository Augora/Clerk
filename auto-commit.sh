#!/bin/bash 

if [ $(git status -s | wc -l) -gt 0 ]; then
  git add .
  git commit -m "[Generated] Auto commit because of a documentation change."
  git push origin master
fi
