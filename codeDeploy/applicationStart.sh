#!/bin/bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start
cd /home/ubuntu/webapp
# if [ -d "logs" ] 
# then
#     echo "Directory /home/ubuntu/webapp/logs exists." 
# else
#     sudo mkdir -p logs
#     sudo touch logs/webapp.log
#     sudo chmod 644 logs/webapp.log
# fi


sudo npm install
sudo npm i pm2 -g
pm2 start server/app.js >> debug.log 2>&1 &