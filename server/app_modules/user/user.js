/*Defines the properties for a User object */
module.exports = class User {

    constructor(username, password, email, _id, role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this._id = _id;
    }


}