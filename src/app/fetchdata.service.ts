import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FetchdataService {

  constructor(private http:HttpClient) { }

  getGroups() {this.http.get<Object>('http://localhost:3000/api/getgroups').subscribe(res => {
    sessionStorage.setItem('groups', JSON.stringify(res));
  })}
}
