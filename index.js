'use strict'

const config = require("./config.js")
const fetch = require("node-fetch")
const journalctlfuckingconstructor = require("journalctl")
const journalctl = new journalctlfuckingconstructor();

console.log("journalctl.log: started...")

if(!config.webhook.url) {
    if(!config.webhook.id || !config.webhook.token) throw "Webhook is not configured! Please put webhook URL to config.js";
    config.webhook.url = `https://discord.com/api/webhooks/${config.webhook.id}/${config.webhook.token}`
}

var webhook = {send: (content => {
    fetch(config.webhook.url, {method: "POST", body: JSON.stringify(typeof content == "string" ? {content} : content), headers: {"Content-Type": "application/json"}})
        .catch(err => console.log(`journalctl.log: error sending webhook: ${err}`))
})}

webhook.send({embeds: [{title: "journalctl.log started..."}]})

var queue = [];
function* pastedChunking(e,n){for(let i=0;i<e.length;i+=n)yield e.slice(i,i+n)} // minified https://stackoverflow.com/a/55435856

var sshregex = /^Accepted (publickey|password) for ([A-Za-z0-9-_]+) from ([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}) port ([0-9]{5})/

setInterval(() => {
    if(!queue.length) return;
    var oqueue = queue; var big = false;
    var msg = "";
    if(queue.length >= 10) {var a = [...pastedChunking(queue, 5)]; queue = a[0]; oqueue = oqueue.slice(5); big = true};
    queue.forEach(a => msg += `\n${a}`); queue = big ? oqueue : []; oqueue = []; msg = msg.replaceAll("*", "\\*").replaceAll("`", "\\`").replaceAll("_", "\\_").replaceAll("|", "\\|").replaceAll("~", "\\~").replaceAll("@", "@ ") // pasted myself
    webhook.send({content: `${msg}`})
}, 1000)

journalctl.on("event", data => {
    queue.push(`<${data.PRIORITY}> [${data._HOSTNAME} ${data._SYSTEMD_UNIT ?? data.SYSLOG_IDENTIFIER}]: ${data.MESSAGE}`)
    if(config.ntfy.enabled) {
        var matched = data.MESSAGE.match(sshregex);
        if(matched) {
            var method = matched[1], user = matched[2], ip = matched[3], port = matched[4]
            if(method && user && ip && port) {
                fetch(config.ntfy.url, {
                    method: "POST",
                    body: `Accepted ${method} for ${user} by ${ip} port ${port}`,
                    headers: {
                        "Title": `Successfull SSH login at ${config.ntfy.hostname}`,
                        "Authorization": `Basic ${btoa(`${config.ntfy.user}:${config.ntfy.password}`)}`
                    }
                }).catch(err => console.log(`journalctl.log: error sending to ntfy: ${err}`))
            }
        }
    }
})
