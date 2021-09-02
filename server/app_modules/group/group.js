class Group {
    constructor(groupname) {
        this.groupname = groupname;
        this.channels = [];
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

