#!/bin/bash

cd /home/ubuntu/webapp
sudo npm i pm2 -g
sudo npm i
sudo pm2 start server/app.js