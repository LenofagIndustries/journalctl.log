# journalctl.log
Logs journalctl to Discord using webhooks

![Discord_qZd7rPxkyR](https://user-images.githubusercontent.com/45996315/230743382-f182bef3-69f0-4ced-b76d-5f6d1eac2840.png)

## Requirements
* node.js v16+
* git
* (optional) [pm2](https://pm2.keymetrics.io/)

## Installation
1. `git clone https://github.com/LenofagIndustries/journalctl.log`
2. `cd journalctl.log`
3. `npm install`
4. Configure `config.js`
5. (optional) Daemonize using `pm2 start index.js --name journalctl.log`
