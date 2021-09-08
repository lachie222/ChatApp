import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FetchdataService } from '../fetchdata.service';

@Component({
  selector: 'app-controlpanel',
  templateUrl: './controlpanel.component.html',
  styleUrls: ['./controlpanel.component.css']
})
export class ControlpanelComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router, private fetchDataService:FetchdataService) {
  }

  groupdata = this.fetchDataService.groupdata;
  user = this.fetchDataService.user;
  groupname:String = "";
  groupselect:String="";
  username1:String = "";
  username2:String = "";
  role:String = "";
  isSuper = false;
  i = 0;

  ngOnInit(): void {
    /*Upon initialisation, the component will fetch groups using user details stored in session storage 
    and then check the role of user */
    this.fetchDataService.fetchGroups();
    this.checkRole();
  }

  checkRole() {
    /*Check role function will check the role of the user to see if they are superadmin, If the user is a superadmin,
    ngIf will be set to true, which will create the promote to superadmin button in html (since only super admins can promote)
    users to superadmin */
    if(this.user !== null) {
      this.role = this.user.role
      if(this.role == 'superadmin') {
        this.isSuper = true;
      }
    }
  }


  createGroup() {
    /* Create group function will send a post request to server to create a new group with groupname param
     and store it in groupstorage, response message will indicate success in console and groups will be refreshed by calling
     fetchGroups() */
    interface message {
      message:String;
    };

    this.http.post<message>('http://localhost:3000/api/creategroup', {user:this.user, groupname:this.groupname}).subscribe(res => { 
        alert(res.message);
        this.groupname = '';
        this.fetchDataService.fetchGroups();
    });
  };

  removeGroup() {
    /* removeGroup function will send a post request to server to remove a group with groupname param from groupstorage,
    response will indicate success and groups will be refreshed by calling fetchGroups() */
    interface message {
      message:String;
    };

    this.http.post<message>('http://localhost:3000/api/removegroup', {user:this.user, groupname:this.groupname}).subscribe(res => { 
        alert(res.message);
        this.groupname = '';
        this.fetchDataService.fetchGroups();
    });
  };

  promoteSuper() {
    /* promoteSuper function will send a post request to server to promote a user's role to superadmin and then update userstorage, message will indicate success in console */
    interface message {
      message:String;
    };

    this.http.post<message>('http://localhost:3000/api/promotesuper', {user:this.user, username:this.username2}).subscribe(res => { 
      alert(res.message);
      this.username2 = '';
      this.fetchDataService.fetchGroups();
  });
  }

  promoteGroupAdmin() {
    /* promoteGroupAdmin function will send a post request to server to promote a user's role to group admin and then update userstorage, message will indicate success in console */
    interface message {
      message:String;
    };

    this.http.post<message>('http://localhost:3000/api/promotegroupadmin', {user:this.user, username:this.username2}).subscribe(res => { 
      alert(res.message);
      this.username2 = '';
      this.fetchDataService.fetchGroups();
  });
  }

  promoteGroupAssis() {
    /* promoteGroupAssis function will send a post request to server to add a username to a specified groups groupassis
    array, thus making the user a groupassis of a group. message will indicate success in console */
    interface message {
      message:String;
    };

    this.http.post<message>('http://localhost:3000/api/promotegroupassis', {user:this.user, username:this.username1, groupname:this.groupselect}).subscribe(res => { 
      alert(res.message);
      this.username1 = '';
      this.fetchDataService.fetchGroups();
  });
  }

}
