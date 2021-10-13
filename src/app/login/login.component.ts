import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  usernamelogin:string="";
  passwordlogin:string="";
  userlogin = JSON.parse(localStorage.getItem('user')!);
  user = {};

  constructor(private router: Router, private http:HttpClient, private appcomponent:AppComponent) { }

  ngOnInit(): void {
    if(this.userlogin) {
      this.router.navigateByUrl('/groups');
    }
  }
  

  login() {
    /* Login function will send a post request to the server with username and password,
    if server authenticates the user with correct username and password, it will send the user data, and also fetch groups
    for the user. If the users role is superadmin or groupadmin, the html button for the control panel will become visible on
    the navbar (as only these roles will have access to the forms inside). If user is not authenticated, it will alert the user that the username and password did not match */
    interface usermessage {
      user:{valid:Boolean, username?:String, _id?:String, role?:String}
      message:String;
      groupdata?:Object;
    };


    this.http.post<usermessage>('http://localhost:3000/api/auth', {username: this.usernamelogin, password: this.passwordlogin}).subscribe(res => { 
      if (res.user.valid == true) {
        localStorage.setItem('user', JSON.stringify(res.user));
        this.user = JSON.parse(localStorage.getItem('user')!);
        this.usernamelogin = '';
        this.passwordlogin = '';
        if(res.user.role == 'superadmin' || res.user.role == 'groupadmin') {
          this.appcomponent.isAdmin = true;
        };

        this.http.post<usermessage>('http://localhost:3000/api/fetchgroups', this.user).subscribe(res => {
          localStorage.setItem('groups', JSON.stringify(res.groupdata));
          this.appcomponent.isValid = true;
          this.router.navigateByUrl('/groups');
        })
      }
    });
  };

}
