#!/bin/bash

./cat.sh
rm out.txt
node out.js test | tee out.txt || exit
git add .
git commit -m .
git push
