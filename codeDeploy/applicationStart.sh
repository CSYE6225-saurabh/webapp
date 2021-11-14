#!/bin/bash

cd /home/ubuntu/webapp
sudo touch cloudwatch/webapp.log
sudo chmod 666 cloudwatch/webapp.log
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start
sudo npm install
sudo npm i pm2 -g
pm2 start server/app.js >> touch debug.log 2>&1 &