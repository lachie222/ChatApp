/*Defines the methods and properties for a Group and Channel object */
class Group {
    constructor(groupname) {
        this.groupname = groupname;
        this.channels = [];
        this.groupassis = [];
    }

    addChannel(channel) {
        this.channels.push(channel);
    }
};

class Channel {
    constructor(channelname){
        this.channelname = channelname;
        this.users = [];
    }

    addUser(username) {
        this.users.push(username)
    }

}

module.exports = {
    Group: Group,
    Channel: Channel
}

