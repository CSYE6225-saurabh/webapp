#!/bin/bash
sudo unzip build_artifact.zip
sudo unzip deploySrcCodeBuild.zip
aws configure set default.region us-east-1
aws configure list
sudo cp /home/ubuntu/webapp/config.json /opt/aws/amazon-cloudwatch-agent/etc/
x
sleep 3

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
	-a fetch-config -m ec2 \
	-c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json -s
    
cd /home/ubuntu/webapp 
sudo rm -rf node_modules
sudo npm i