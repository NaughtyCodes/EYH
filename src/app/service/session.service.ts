import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

   routeParam: any;

  constructor() {
    console.log("calling Sesssion Service. "+formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530').toString());
  }

  
   setParamObj(p: any){
    this.routeParam = p;
    localStorage.setItem("storyView", p);
  }

  getParamObj(){
    return localStorage.getItem("storyView");
  }

}
