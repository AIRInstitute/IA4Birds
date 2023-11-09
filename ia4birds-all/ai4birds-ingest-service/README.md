## ai4birds-ingest-service API

Project description


## Install requirements

```bash
sudo apt update
sudo apt install python3 python3-pip nodejs npm -y
sudo npm install -g pm2
```

## Deploy application

### PM2 deployment

Application can be launched with the launch script:
```bash
sudo bash launch.sh
```
Or using PM2:
```bash
sudo pm2 start pm2.json
```
Note: if the script `launch.sh` doesn't works, you can use `launch2.sh` instead.

### Docker deployment

Build image and run

```bash
sudo docker build -t ai4birds_ingest_service .
sudo docker run -it --rm --name ai4birds-ingest-service ai4birds_ingest_service
```

## Run application

For running directly the application in a "raw" way:
```bash
sudo python3 -m pip install pip --upgrade
sudo python3 -m pip install . --upgrade
sudo ai4birds_ingest_service
```


## Disclaimer

Component developed by AIRInstitute (@AIRInstitute on GitHub) on 2023. For manteinance and bug reports please contact the developer at bisite@usal.es.
Copyright AIRInstitute 2023. All rights reserved. See license for details.