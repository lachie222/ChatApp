import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FetchdataService } from '../fetchdata.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private http:HttpClient, private fetchDataService:FetchdataService) { 
  }
  groupdata = this.fetchDataService.groupdata;
  groupAssis = this.fetchDataService.groupAssis;
  isGroupAssis = this.fetchDataService.isGroupAssis;
  groupname:String="";
  channelname:String="";
  groupselect:String="";
  message:String="";

  ngOnInit(): void {
    /*Upon initialisation, groups will be fetched, and will check if user is a groupassis */
    this.fetchDataService.fetchGroups();
    this.fetchDataService.checkGroupAssis();
  }

  createChannel() {
    /*create Channel function will send a post request to server to create a new channel with groupname and channelname
    as params and store it in server storage, response message will indicate success. Groups will be refreshed using
    fetchGroups once complete. */
    interface message {
      message:string;
    };

    this.http.post<message>('http://localhost:3000/api/createchannel', {user: this.fetchDataService.user, groupname: this.groupselect, channelname: this.channelname}).subscribe(res => { 
        alert(res.message);
        this.channelname = '';
        this.fetchDataService.fetchGroups();
    });
  };

  removeChannel() {
    /*create Channel function will send a post request to server to remove a channel with groupname and channelname
    as params and remove it from server storage, response message will indicate success. Groups will be refreshed using
    fetchGroups once complete. */
    interface message {
      message:string;
    };

    this.http.post<message>('http://localhost:3000/api/removechannel', {user: this.fetchDataService.user, groupname: this.groupselect, channelname: this.channelname}).subscribe(res => { 
        alert(res.message);
        this.channelname = '';
        this.fetchDataService.fetchGroups();
    });
  };

}
