#!/bin/bash

cd /home/ubuntu/webapp
if [ -d "logs" ] 
then
    echo "Directory /home/centos/webapp/logs exists." 
else
    sudo touch logs/webapp.log
    sudo chmod 666 logs/webapp.log
fi
sudo npm install
sudo npm i pm2 -g
pm2 start server/app.js >> touch debug.log 2>&1 &