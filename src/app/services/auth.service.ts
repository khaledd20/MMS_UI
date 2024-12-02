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

  // Define permissions$ as a BehaviorSubject
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(loginRequest: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, loginRequest).pipe(
      tap((response: any) => {
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
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);

      // Save the token in localStorage for future use
      localStorage.setItem('authToken', token);

      // Fetch permissions dynamically
      this.fetchPermissions().subscribe({
        next: (permissionsResponse) => {
          console.log('Permissions Response:', permissionsResponse);

          // Extract the roleId from the response
          const roleId = permissionsResponse?.roleId;

          // Navigate based on the roleId
          this.navigateToDefaultRoute(roleId);
          
        },
        error: (err) => {
          console.error('Failed to fetch permissions:', err);
          this.router.navigate(['/login']); // Redirect to login on error
        },
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']); // Redirect to login on error
    }
  }
  logout(): void {
    localStorage.removeItem('authToken'); // Clear the token
    console.log('User logged out successfully');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; // Returns true if the token exists
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
    switch (roleId) {
      case 1: // Admin
        this.router.navigate(['/admin']);
        break;
      case 2: // Organizer
        this.router.navigate(['/organizer']);
        break;
      case 3: // Participant
        this.router.navigate(['/participant']);
        break;
      default:
        console.error('Invalid role ID:', roleId);
        this.router.navigate(['/login']); // Fallback to login
        break;
    }
  }

  private fetchPermissions(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(this.permissionsUrl, { headers });
  }
}
