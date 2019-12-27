import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private static instance:SessionService = null;
   routeParam: any;

  constructor() {
    console.log("calling Sesssion Service. "+formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530').toString());
  }

  public static getInstance():SessionService{
    if(SessionService.instance == null){
      SessionService.instance = new SessionService();
    }         
    return SessionService.instance;    
  }

   setParamObj(p: any){
    this.routeParam = p;
  }

  getParamObj(){
    return this.routeParam;
  }

}
