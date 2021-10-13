import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';

/* interface for chatdata will assign properties to be examined by ngFor in html */
export interface ChatData {
  username: string;
  message: string;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private ChatService: ChatService) { 
  }


  user = JSON.parse(localStorage.getItem('user')!);
  groupname:string="";
  username:string="";
  channelname:string="";
  message:string = "";
  roomName:Object= {};
  connection:Object = {};
  chatdata:ChatData = {username: this.user, message: this.message};
  ioConnection:any;
  messages:Array<ChatData> = [];

  ngOnInit(): void {

    /*On initialisation, the params from the route will become the group and channel name variables,
    Chat data will then be received using these variables as input*/
    this.groupname = this.route.snapshot.params.group;
    this.channelname = this.route.snapshot.params.channel;
    this.roomName = {groupname: this.groupname, channelname: this.channelname};
    this.connection = {username: this.user.username, location: this.roomName};
    localStorage.setItem('roomName', JSON.stringify(this.roomName));
    //this.retrieveChat(this.groupname, this.channelname);
    this.ChatService.connect(this.connection);
    this.initIoConnection();
    this.retrieveChat();
  }

  retrieveChat() {
    /* Retrievechat function sends post request to server to retrieve chat history with groupname and channel name as params.
    Chat is then stored in the chatdata variable so it can be displayed in html via data binding*/
    interface chatresponse {
      chatdata:Array<ChatData>;
      message:string;
    };

    this.http.post<chatresponse>('http://localhost:3000/api/retrievechat', this.roomName).subscribe(res => {
        console.log(res.message);
        this.messages = res.chatdata;
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

  private initIoConnection() {
    this.ioConnection = this.ChatService.onMessage()
    .subscribe((chatdata:ChatData) => {
      console.log(chatdata);
      this.messages.push(chatdata);
    })
  }

  chat() {
    if(this.message) {
      this.chatdata = {username: this.user.username, message: this.message};
      this.ChatService.send({chatdata: this.chatdata, location: this.roomName});
      this.messages.push(this.chatdata);
      this.message='';
    }else{
      console.log("no message");
    }
  }
}
