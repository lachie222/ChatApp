/*Defines the methods and properties for a chat object */
module.exports = class Chat {
    constructor(groupname, channelname) {
        this.location = {groupname, channelname};
        this.chatdata = [];
    }

    addMessage(username, message) {
        this.chatdata.push({username, message})
    }
};