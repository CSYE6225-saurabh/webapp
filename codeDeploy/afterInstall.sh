#!/bin/bash
sudo unzip build_artifact.zip
sudo unzip deploySrcCodeBuild.zip
aws configure set default.region us-east-1
aws configure list
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/webapp/cloudwatch/config.json -s
cd ..
cd /home/ubuntu/webapp 
sudo rm -rf node_modules
sudo npm i