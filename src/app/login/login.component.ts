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
  usercreate:string="";
  passcreate:string="";
  emailcreate:string="";
  user = {};

  constructor(private router: Router, private http:HttpClient, private appcomponent:AppComponent) { }

  ngOnInit(): void {
  }
  

  login() {
    /* Login function will send a post request to the server with username and password,
    if server authenticates the user with correct username and password, it will send the user data, and also fetch groups
    for the user. If the users role is superadmin or groupadmin, the html button for the control panel will become visible on
    the navbar (as only these roles will have access to the forms inside). If user is not authenticated, it will alert the user that the username and password did not match */
    interface usermessage {
      user:{valid:Boolean, role:String}
      message:String;
      groupdata?:Object;
    };

    this.http.post<usermessage>('http://localhost:3000/api/auth', {username: this.usernamelogin, password: this.passwordlogin}).subscribe(res => { 
      if (res.user.valid == true) {
        sessionStorage.setItem('user', JSON.stringify(res.user));
        this.user = JSON.parse(sessionStorage.getItem('user')!);
        alert(res.message);
        this.usernamelogin = '';
        this.passwordlogin = '';

        /*Custom fetchgroup function is used to account for latency. 3 second timeout ensures that server is able to respond in time before the component will navigate away */
        this.http.post<usermessage>('http://localhost:3000/api/fetchgroups', this.user).subscribe(res => {
          sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
          setTimeout(()=> {
            this.appcomponent.isValid = true;
            if(res.user.role == 'superadmin' || res.user.role == 'groupadmin') {
              this.appcomponent.isAdmin = true;
            };
            this.router.navigateByUrl('/groups');
          }, 3000)
        })
      }
      else {alert(res.message)} 
    });
  };

  register() {
    /*Register user function will send a post request to create a new user using email, username and password.
    response will indicate if registration was successful. */
    interface usermessage {
      message:String;
    }

    this.http.post<usermessage>('http://localhost:3000/api/register', {email: this.emailcreate, username: this.usercreate, password: this.passcreate}).subscribe(res => { 
        alert(res.message);
        this.emailcreate='';
        this.usercreate='';
        this.passcreate='';
    });
  }
}
