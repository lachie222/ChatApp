class Group {
    constructor(groupid, groupname) {
        this.groupid = groupid;
        this.groupname = groupname;
    }
};

class Channel extends Group {
    constructor(groupid, groupname, channelid, channelname, users){
        super(groupid, groupname);
        this.channelid = channelid;
        this.channelname = channelname;
        this.users = users;
    }

}

module.exports = {
    Group: Group,
    Channel: Channel
}

