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
    this.socket = io(SERVER_URL);
    this.socket.emit('join room', connection);
   }

  public send(sendChat:Object): void {
    this.socket.emit('message', sendChat);
  }
  
  public onMessage(): Observable<any> {
    let observable = new Observable(observer=> {
      this.socket.on('message', (data:string) => observer.next(data));
    });
    return observable;
  }

  public disconnect(connection:Object) {
    if (this.socket) {;
      this.socket.emit('leave', connection);
    }
  }
}
