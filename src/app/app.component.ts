import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chatapp';

  constructor(private route:Router, private ChatService: ChatService) { }
  isAdmin = false;
  isValid = false;
  user = JSON.parse(sessionStorage.getItem('user')!);
  role:String = '';
  valid:Boolean = false;

  ngOnInit(): void {
    /*Upon loading the app, check role and valid user will ensure that the correct navbar is displayed upon reloading a page
    or switching to another component */
    this.checkRole();
    this.checkValid();
  }

  checkRole() {
    /*Check role checks to see if a user is an admin or superadmin, and if true will display control panel on the navbar in html */
    if(this.user !== null) {
      this.role = this.user.role
      if(this.role == 'superadmin' || this.role == 'groupadmin') {
        this.isAdmin = true;
      }
    }
  }

  checkValid() {
    /*Check valid will check to see if a user is logged in, if a user is logged in, the navbar will display chat and logout button */
    if(this.user !== null) {
      this.valid = this.user.valid
      if(this.valid == true) {
        this.isValid = true;
      }
    }
  }

  disconnect() {
    this.ChatService.disconnect(this.user.username);
  }

  logout() {
    /*Logout button will clear the navbar states and clear user and group information from session storage, and return to the
    login page */
    sessionStorage.clear();
    this.isAdmin = false;
    this.isValid = false;
    this.route.navigateByUrl("/")
  }


}
