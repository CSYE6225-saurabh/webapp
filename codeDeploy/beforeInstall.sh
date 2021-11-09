#!/bin/bash
cd /home/ubuntu
sudo rm -rf webapp
PID = `ps aux | grep PM2`
if [[ "" !=  "$PID" ]]; then
 sudo kill -9 $PID
fi
