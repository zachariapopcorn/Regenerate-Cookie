const roblox = require('noblox.js');
const fs = require('fs');

exports.run = async (client, message, args) => {
    if(message.author.id != "465362236693807115") {
        return message.channel.send("You don't have permission to run this command!");
    }
    if(message.channel.type !== "dm") {
        return message.channel.send("This command only works in DMS!");
    }
    let cookie = client.config.cookie;
    let isValidCookie = true;
    try {
        await roblox.setCookie(cookie);
    } catch {
        isValidCookie = false;
    }
    if(isValidCookie == true) {
        return message.channel.send("The cookie that is currently being used is a valid one!");
    }
    if(!args[0]) {
        return message.client.send("Please insert a username!");
    }
    try {
        await roblox.getIdFromUsername(args[0]);
    } catch {
        return message.channel.send("The username you provided doesn't exist in the Roblox database!");
    }
    if(!args[1]) {
        return message.channel.send("Please insert a password!");
    }
    let username = args[0];
    let password = args[1];
    let jar = roblox.jar();
    try {
        await roblox.login(username, password, jar);
    } catch (err) {
        return message.channel.send("There was an error while getting a new cookie: " + err);
    }
    client.config.cookie = jar.session;
    roblox.setCookie(jar.session);
    let configFile = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    configFile.cookie = jar.session;
    fs.writeFile('./config.json', JSON.stringify(configFile), (err) => {
        if(err) {
            return message.channel.send("There was an error while writing the cookie to the config file: " + err);
        }
    });
    return message.channel.send('Successfully regenerated the cookie!');
}
