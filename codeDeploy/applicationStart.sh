#!/bin/bash

cd /home/ubuntu/webapp
sudo nohup node server/app.js >> debug.log 2>&1 &