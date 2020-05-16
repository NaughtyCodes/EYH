import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SocialloginService } from '../../service/sociallogin.service'; 

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private _socialLoginService: SocialloginService, private _router: Router) {
    console.log('calling login guard');
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    console.log(window.location.pathname);
    console.log('login => '+this._socialLoginService.getAuthStatus());
    
    if (!this._socialLoginService.getAuthStatus()) {
      return true;
    } 
    // else if(window.location.pathname === '/login' && this._socialLoginService.getAuthStatus()){
    //   return true;
    // } 
    this._router.navigate(['/dashboard']);
    return false;
  }

}
