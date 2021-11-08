#!/bin/bash

cd /home/ubuntu/webapp
sudo npm i pm2 -g
sudo pm2 start server/app.js