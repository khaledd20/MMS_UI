import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {jwtDecode} from 'jwt-decode'; // Correct import

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = `${environment.APIBaseURL}/auth/login`;
  private registerUrl = `${environment.APIBaseURL}/auth/register`;
  private permissionsUrl = `${environment.APIBaseURL}/api/permissions`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.loadTokenOnInit(); // Reload permissions
  }
  private loadTokenOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const permissions = decodedToken.Permission
          ? Array.isArray(decodedToken.Permission)
            ? decodedToken.Permission
            : [decodedToken.Permission]
          : [];
        this.permissionsSubject.next(permissions);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout();
      }
    }
  }
  
  // Define permissions$ as a BehaviorSubject
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadTokenOnInit(); // Reload token and permissions when app initializes

  }

  login(loginRequest: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, loginRequest).pipe(
      tap((response: any) => {
        this.saveToken(response.token);
        localStorage.setItem('authToken', response.token);
        this.isLoggedInSubject.next(true); // Notify components that the user is logged in
      })
    );
  }

  register(registerRequest: { name: string; email: string; password: string; roleId: number }): Observable<any> {
    return this.http.post(this.registerUrl, registerRequest);
  }

  handleLoginResponse(response: any): void {
    const token = response.bearer;
  
    try {
      const decodedToken: any = jwtDecode(token);
  
      // Extract permissions from the token
      const permissions = decodedToken.Permission
        ? (Array.isArray(decodedToken.Permission) ? decodedToken.Permission : [decodedToken.Permission])
        : [];
  
      // Save the token and permissions
      localStorage.setItem('authToken', token);
      this.permissionsSubject.next(permissions); // Update the permissions BehaviorSubject
  
      console.log('Permissions:', permissions);
      this.navigateToDefaultRoute(parseInt(decodedToken.RoleId, 10));
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']);
    }
  }
  
  logout(): void {
    localStorage.removeItem('authToken'); // Clear the token
    console.log('User logged out successfully');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
  
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime; // Ensure token is not expired
    } catch (e) {
      return false;
    }
  }
  
  
  getCurrentUser(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return {
          userId: decodedToken.UserId, // Ensure 'UserId' matches the token structure
          name: decodedToken.name || '', // Extract 'name' from the token
          email: decodedToken.email || '', // Extract 'email' from the token
          roleId: decodedToken.RoleId ? parseInt(decodedToken.RoleId, 10) : null, // Ensure 'RoleId' is parsed as an integer
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  
  updateUser(user: any): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve the JWT token
    const headers = { Authorization: `Bearer ${token}` }; // Attach token in headers
    return this.http.put(`${environment.APIBaseURL}/auth/users/${user.userId}`, user, { headers });
  }
  

  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${environment.APIBaseURL}/users/${userId}`, { headers });
  }

  searchUsers(query: string): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(`${environment.APIBaseURL}/users/search?query=${query}`, { headers });
  }


  private navigateToDefaultRoute(roleId: number): void {
    this.router.navigate(['/admin']); // All users go to admin
}


  private fetchPermissions(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(this.permissionsUrl, { headers });
  }
}
