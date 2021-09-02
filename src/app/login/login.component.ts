import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  username:string="";
  password:string="";
  error:string="";
  userlogin = {};
  userdata = {};

  constructor(private router: Router, private http:HttpClient) { }

  ngOnInit(): void {
  }
  

  itemClicked() {
    interface uservalid {
      valid:Boolean;
    };

    this.userlogin = {username: this.username, password: this.password};
    this.http.post<uservalid>('http://localhost:3000/api/auth', this.userlogin).subscribe(res => { 
      if (res.valid == true) {
        sessionStorage.setItem('user', JSON.stringify(res));
        console.log(sessionStorage.getItem('user'));
      } else {
        alert("Username and Password do not match!")
      }
    });
  };
}
