#!/bin/bash
cd /home/ubuntu
sudo rm -rf webapp
# echo "get the proces id"
# PID=`ps -eaf | grep "pm2 start server/app.js" | grep -v grep | awk '{print $2}'`
# echo "process id not empty ? $PID"
# if [[ "" !=  "$PID" ]]; then
#  sudo kill -9 $PID
# fi
# sudo fuser -n tcp -k 4000 

PID = `ps aux | grep PM2`
if [[ "" !=  "$PID" ]]; then
 sudo kill -9 $PID
fi
