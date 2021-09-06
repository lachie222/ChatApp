import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FetchdataService } from '../fetchdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlpanelComponent implements OnInit {

  constructor(private http:HttpClient, private FetchdataService:FetchdataService, private router:Router) {
  }

  user = sessionStorage.getItem('user');
  groupdata = JSON.parse(sessionStorage.getItem('groups')!);
  groups = this.groupdata.groups;
  channels = this.groups.channels;
  groupname:String = "";
  groupselect:String= "";
  groupselect2:String="";
  groupselect3:String="";
  channelselect:String="";
  channelname:String= "";
  username:String = "";
  username2:String = "";
  username3:String = "";
  grouprequest = {};
  channelrequest = {};
  userrequest = {};
  promoterequest = {};
  promotega = {};
  i = 0;

  ngOnInit(): void {
    //this.FetchdataService.getGroups();
  }

  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
  };

  select() {
    for (this.i=0; this.i<this.groups.length; this.i++) {
      if(this.groupselect2 == this.groups[this.i].groupname) {
        this.channels = this.groups[this.i].channels;
      }
    }
  };

  createGroup() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.grouprequest = {user: this.user, groupname: this.groupname};
    this.http.post<message>('http://localhost:3000/api/creategroup', this.grouprequest).subscribe(res => { 
        alert(res.message);
        console.log(res);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  removeGroup() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.grouprequest = {user: this.user, groupname: this.groupname};
    this.http.post<message>('http://localhost:3000/api/removegroup', this.grouprequest).subscribe(res => { 
        alert(res.message);
        console.log(res);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  createChannel() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.channelrequest = {user: this.user, groupname: this.groupselect, channelname: this.channelname};
    this.http.post<message>('http://localhost:3000/api/createchannel', this.channelrequest).subscribe(res => { 
        alert(res.message);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  removeChannel() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.channelrequest = {user: this.user, groupname: this.groupselect, channelname: this.channelname};
    this.http.post<message>('http://localhost:3000/api/removechannel', this.channelrequest).subscribe(res => { 
        alert(res.message);
        console.log(res);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  addUser() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.userrequest = {user: this.user, groupname: this.groupselect2, channelname: this.channelselect, username: this.username};
    console.log(this.channelselect);
    this.http.post<message>('http://localhost:3000/api/adduser', this.userrequest).subscribe(res => { 
        alert(res.message);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  removeUser() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.userrequest = {user: this.user, groupname: this.groupselect2, channelname: this.channelselect, username: this.username};
    console.log(this.channelselect);
    this.http.post<message>('http://localhost:3000/api/removeuser', this.userrequest).subscribe(res => { 
        alert(res.message);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
        setTimeout(() => {
          this.reloadComponent();
      }, 1000);
    });
  };

  promoteSuper() {
    interface message {
      message:String;
    };

    this.promoterequest = {user: this.user, username: this.username3}
    this.http.post<message>('http://localhost:3000/api/promotesuper', this.promoterequest).subscribe(res => { 
      alert(res.message);
      setTimeout(() => {
        this.reloadComponent();
    }, 1000);
  });
  }

  promoteGroupAdmin() {
    interface message {
      message:String;
    };

    this.promoterequest = {user: this.user, username: this.username3}
    this.http.post<message>('http://localhost:3000/api/promotegroupadmin', this.promoterequest).subscribe(res => { 
      alert(res.message);
      setTimeout(() => {
        this.reloadComponent();
    }, 1000);
  });
  }

  promoteGroupAssis() {
    interface message {
      groupdata:Object;
      message:String;
    };

    this.promotega = {user: this.user, username: this.username2, groupname: this.groupselect3}
    this.http.post<message>('http://localhost:3000/api/promotegroupassis', this.promotega).subscribe(res => { 
      alert(res.message);
      sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
      setTimeout(() => {
        this.reloadComponent();
    }, 1000);
  });
  }

}
