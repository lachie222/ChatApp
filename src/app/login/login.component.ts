import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FetchdataService } from '../fetchdata.service';

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
  error:string="";
  userlogin = {};
  userregister = {};
  userdata = {};

  constructor(private router: Router, private http:HttpClient, private FetchdataService:FetchdataService) { }

  ngOnInit(): void {
  }
  

  login() {
    interface usermessage {
      user:{valid:Boolean, username:String, password:String, email:String}
      msg:String;
      groupdata:Object;
    };

    this.userlogin = {username: this.usernamelogin, password: this.passwordlogin};
    this.http.post<usermessage>('http://localhost:3000/api/auth', this.userlogin).subscribe(res => { 
      if (res.user.valid == true) {
        sessionStorage.setItem('user', JSON.stringify(res.user));
        console.log(sessionStorage.getItem('user'));
        alert(res.msg);
        sessionStorage.setItem('groups', JSON.stringify(res.groupdata));
      } else {
        alert(res.msg)
      }
      setTimeout(() => {
        this.router.navigate(['/controlpanel']);
    }, 1000);
    });
  };

  register() {
    interface usermessage {
      msg:String;
    }

    this.userregister = {email: this.emailcreate, username: this.usercreate, password: this.passcreate};
    this.http.post<usermessage>('http://localhost:3000/api/register', this.userregister).subscribe(res => { 
        alert(res.msg);
        window.location.reload();
    });
  }
}
