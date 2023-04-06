'use strict'

const config = require("./config.js")
const Discord = require("discord.js")
const journalctlfuckingconstructor = require("journalctl")
const journalctl = new journalctlfuckingconstructor();

console.log("journalctl.log: started...")

const webhook = new Discord.WebhookClient({id: config.webhook.id, token: config.webhook.token})
webhook.send({embeds: [{title: "journalctl.log started..."}]})

var queue = [];

function* pastedChunking(e,n){for(let i=0;i<e.length;i+=n)yield e.slice(i,i+n)} // minified https://stackoverflow.com/a/55435856

setInterval(() => {
    if(!queue.length) return;
    var oqueue = queue; var big = false;
    var msg = "";
    if(queue.length >= 10) {var a = [...pastedChunking(queue, 5)]; queue = a[0]; oqueue = oqueue.slice(5); big = true};
    queue.forEach(a => msg += `\n${a}`); queue = big ? oqueue : []; oqueue = []; msg = msg.replaceAll("*", "\\*").replaceAll("`", "\\`").replaceAll("_", "\\_").replaceAll("|", "\\|").replaceAll("~", "\\~").replaceAll("@", "@ ") // pasted myself
    webhook.send({content: `${msg}`}).catch(err => console.log(`journalctl.log: error sending: ${err}`))
}, 1000)

journalctl.on("event", data => {
    queue.push(`<${data.PRIORITY}> [${data._HOSTNAME} ${data._SYSTEMD_UNIT ?? data.SYSLOG_IDENTIFIER}]: ${data.MESSAGE}`)
})

webhook.on("rateLimit", (data) => {
    console.log(`journalctl.log: webhook rate limited! ends in ${Math.round(data.timeout)}ms`)
})