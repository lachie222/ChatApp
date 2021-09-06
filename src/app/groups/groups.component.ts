import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FetchdataService } from '../fetchdata.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private http:HttpClient, private FetchdataService:FetchdataService) { 
  }
  groupdata = JSON.parse(sessionStorage.getItem('groups')!);
  groups = this.groupdata.groups;
  channels = this.groups.channels;

  ngOnInit(): void {
  }
}
