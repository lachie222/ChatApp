import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ChannelData {
  channelname: String;
}

export interface GroupData {
  groupname: String;
  channels:Array<ChannelData>;
  groupassis:Array<String>;
};

@Injectable({
  providedIn: 'root'
})
export class FetchdataService {

  constructor(private http:HttpClient) { }

  public user = JSON.parse(sessionStorage.getItem('user')!);
  public groupdata:Array<GroupData> = [];
  public isGroupAssis = false;
  public groupAssis:Array<GroupData> = [];
  i = 0;
  x = 0;

  fetchGroups() {
    interface message {
      groupdata:Array<GroupData>
    }

    this.http.post<message>('http://localhost:3000/api/fetchgroups', this.user).subscribe(res => {
      sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
      this.groupdata = (res.groupdata);
    })
  }

  checkGroupAssis() {
    /*checkGroupAssis function will check if a user is a group assistant of any groups,
    if user is a group assistant, it will show the html form for creating channels in the group that
    the user is an assistant in */
    if(this.user.role !== 'user') {
      this.isGroupAssis = true;
      this.groupAssis = this.groupdata;
    }else {
      for(this.i=0; this.i<this.groupdata.length; this.i++) {
        for(this.x=0; this.x<this.groupdata[this.i].groupassis.length; this.x++) {
          if(this.groupdata[this.i].groupassis[this.x] == this.user.username) {
            this.isGroupAssis = true;
            this.groupAssis.push(this.groupdata[this.i])
          }
        }
      }
    }
  }
  
}
