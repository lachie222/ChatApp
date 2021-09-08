import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/* interface for chatdata will assign properties to be examined by ngFor in html */
export interface ChatData {
  username: String;
  message: String;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { 
  }


  user = JSON.parse(sessionStorage.getItem('user')!);
  chatdata:Array<ChatData> = [];
  groupname:String="";
  username:String="";
  channelname:String="";
  message:String = "";

  ngOnInit(): void {

    /*On initialisation, the params from the route will become the group and channel name variables,
    Chat data will then be received using these variables as input*/
    this.groupname = this.route.snapshot.params.group;
    this.channelname = this.route.snapshot.params.channel;
    this.retrieveChat(this.groupname, this.channelname);
  }

  retrieveChat(groupname:String, channelname:String) {
    /* Retrievechat function sends post request to server to retrieve chat history with groupname and channel name as params.
    Chat is then stored in the chatdata variable so it can be displayed in html via data binding*/
    interface chatresponse {
      chatdata:Array<ChatData>;
      message:string;
    };

    this.http.post<chatresponse>('http://localhost:3000/api/retrievechat', {groupname: groupname, channelname: channelname}).subscribe(res => {
        console.log(res.message);
        this.chatdata = res.chatdata;
    });
  };

  createMessage() {
    /* createMessage function sends post request to server to create a new chat object and send it to chat history using username, groupname and channel name as params, once a message has been sent, the chat will refresh itself by calling retrievechat function and message box will be reset */
    interface message {
      message:string;
    };

    this.http.post<message>('http://localhost:3000/api/createchat', {user: this.user, groupname: this.groupname, channelname: this.channelname, message: this.message}).subscribe(res => {
        this.retrieveChat(this.groupname, this.channelname);
        console.log(res.message);
        this.message = '';
    });
  };

  addUser() {
    /* addUser function will send a post request to server to add a username to the specified group/channel combos users array
    in group storage on the server */
    interface message {
      message:string;
    };

    this.http.post<message>('http://localhost:3000/api/adduser', {user: this.user, groupname: this.groupname, channelname: this.channelname, username: this.username}).subscribe(res => { 
        alert(res.message);
        this.username = '';
    });
  };

  removeUser() {
    /* removeUser function will send a post request to server to remove a username to the specified group/channel comobos users array in group storage on the server */
    interface message {
      message:string;
    };

    this.http.post<message>('http://localhost:3000/api/removeuser', {user: this.user, groupname: this.groupname, channelname: this.channelname, username: this.username}).subscribe(res => { 
        alert(res.message);
        this.username = '';
    });
  };
}
