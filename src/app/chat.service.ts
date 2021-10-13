import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
const SERVER_URL = 'http://localhost:3000';

/* interface for chatdata will assign properties to be examined by ngFor in html */
export interface ChatData {
  username: string;
  message: string;
};

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  
  
  socket:any;
  constructor() {
   };

  public connect(connection:Object) {
    /*This will connect a user to a room given the users username and room location via serverside sockets */
    this.socket = io(SERVER_URL);
    this.socket.emit('join room', connection);
   }

  public send(sendChat:Object): void {
    /*This will send a username and a chatobject to a specified room via serverside sockets */
    this.socket.emit('message', sendChat);
  }
  
  public onMessage(): Observable<any> {
    /*This will return a chatdata object as an observable whenever a new object is streamed */
    let observable = new Observable(observer=> {
      this.socket.on('message', (data:string) => observer.next(data));
    });
    return observable;
  }

  public disconnect(connection:Object) {
    /*This will disconnect a user from a room */
    if (this.socket) {;
      this.socket.emit('leave', connection);
    }
  }
}
