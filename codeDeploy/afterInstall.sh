#!/bin/bash
sudo unzip build_artifact.zip
sudo unzip deploySrcCodeBuild.zip
cd ..
cd /home/ubuntu/webapp 
sudo rm -rf node_modules
sudo npm i