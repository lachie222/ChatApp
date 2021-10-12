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

  public connect(username:string, roomName:string) {
    this.socket = io(SERVER_URL);
    this.socket.emit('join room', username, roomName);
   }

  public send(chatdata:ChatData, roomName:string): void {
    this.socket.emit('message', chatdata, roomName);
  }
  
  public onMessage(): Observable<any> {
    let observable = new Observable(observer=> {
      this.socket.on('message', (data:string) => observer.next(data));
    });
    return observable;
  }

  public disconnect(username:string, roomName:string) {
    if (this.socket) {;
      this.socket.emit('leave', username, roomName);
    }
  }
}
