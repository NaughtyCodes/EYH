import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocialloginService {

  headerOptions: any = null;
  _isLoggedIn: boolean = false;
  authSub = new Subject<any>();
  url: any;
  
  constructor(
    private http: HttpClient,
    private router: Router  
    ) { }
  
  Savesresponse(responce) {
    this.url = 'http://localhost:64726/Api/Login/Savesresponse';
    return this.http.post(this.url, responce);
  }

  updateAuthStatus(value: boolean) {
    this._isLoggedIn = value
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', value ? "true" : "false");
  }

  logoutUser() {
    this._isLoggedIn = false;
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', "false");
    localStorage.setItem('socialusers', "false");
    this.router.navigate(['/login']);
  }

  getAuthStatus(){
    this._isLoggedIn = localStorage.getItem('isLoggedIn') == "true" ? true : false;
    return this._isLoggedIn
    //return true;
  }

}