#!/bin/bash

if ! type node > /dev/null 2>&1;then
    echo "Node.js is not installed!"
    exit 2
fi

if ! type git > /dev/null 2>&1;then
    echo "git is not installed!"
    exit 2
fi

echo "Cloning repository..."

git clone https://github.com/LenofagIndustries/journalctl.log
if ! [ -d journalctl.log ];then
    echo "Failed to clone repository!"
    exit 1
fi

echo "Installing dependencies..."
cd journalctl.log
npm install

echo "Done! Configure webhook in config.js."
echo "pm2 start index.js --name journalctl.log"
