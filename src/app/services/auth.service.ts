import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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

  // Define permissions$ as a BehaviorSubject
  private permissionsSubject = new BehaviorSubject<string[]>([]);
  public permissions$ = this.permissionsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(loginRequest: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, loginRequest);
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

  getCurrentUser(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return {
          userId: decodedToken?.unique_name || decodedToken?.id, // Adjust based on your JWT structure
          name: decodedToken?.name || '',
          email: decodedToken?.email || '',
          roleId: parseInt(decodedToken?.RoleId, 10), // Parse roleId as an integer
        };
      } catch (error) {
        console.error('Error decoding token in getCurrentUser:', error);
        return null;
      }
    }
    return null;
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
