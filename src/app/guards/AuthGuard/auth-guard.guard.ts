import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SocialloginService } from '../../service/sociallogin.service'; 
import { EyhUserhandlerService } from '../../service/eyh-userhandler.service';
import { Observable, of, Subscriber, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  private user: any;
  constructor(private _socialLoginService: SocialloginService, 
              private eyhUserhandlerService: EyhUserhandlerService, 
              private _router: Router) {
    console.log('calling auth guard');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    console.log(window.location.pathname);

    if (this._socialLoginService.getAuthStatus()) {
      let user = JSON.parse(localStorage.getItem('socialusers'));
      if(user.grants.includes('all')){
        return true;
      } else if(user.grants.includes(window.location.pathname.split('/')[1]) || window.location.pathname.split('/')[1] === ""){
        return true;
      } else {
        return false;
      }
     }

    this._router.navigate(['/login']);
    return false;
  }
  
}
