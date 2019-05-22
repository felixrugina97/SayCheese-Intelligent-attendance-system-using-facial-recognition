#!/bin/bash

kill -9 $(lsof -t -i:5000)

if [ "$1" ]; then
    WHERE="$1"
else
    WHERE="$PWD"
fi

find "$WHERE" \
    -name '__pycache__' -delete -print \
    -o \
    -name '*.pyc' -delete -print
