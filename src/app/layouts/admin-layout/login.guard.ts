import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from '../../app.component';
import { FirebaseService } from '../../shared/firebase.service'
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    public firebaseService: FirebaseService,
    public router: Router
    ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.firebaseService.isLoggedIn() !== true) {
        
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url }})
        return false;  
      }
        return true;
    
      // return this.firebaseService.isLoggedIn();
  }
  
}
