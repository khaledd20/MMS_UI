import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user has the required permissions
    const requiredPermission = route.data['requiredPermission']; // Define in routes
    return this.authService.permissions$.pipe(
      map((permissions) => {
        if (!requiredPermission || permissions.includes(requiredPermission)) {
          return true;
        } else {
          this.router.navigate(['/unauthorized']); // Redirect if no permission
          return false;
        }
      })
    );
  }
}
