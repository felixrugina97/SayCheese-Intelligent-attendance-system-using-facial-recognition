#!/bin/bash

path="$(dirname "$0")"
cd "$path"

mkdir -p ../../logs
rm -rf ../../logs/saycheese.log
touch ../../logs/saycheese.log
