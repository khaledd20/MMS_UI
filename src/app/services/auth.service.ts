import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {jwtDecode} from 'jwt-decode'; // Corrected import

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = `${environment.APIBaseURL}/auth/login`;
  private registerUrl = `${environment.APIBaseURL}/auth/register`;

  constructor(private http: HttpClient, private router: Router) {}

  login(loginRequest: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, loginRequest);
  }
  register(registerRequest: { name: string; email: string; password: string; roleId: number }): Observable<any> {
    return this.http.post(this.registerUrl, registerRequest);
  }
  handleLoginResponse(response: any): void {
    // Extract token from response
    const token = response.bearer;

    try {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);

      // Extract RoleId and ensure it's a number
      const roleId = parseInt(decodedToken.RoleId, 10);

      // Save the token in localStorage for future use
      localStorage.setItem('authToken', token);

      // Navigate based on the role
      switch (roleId) {
        case 1: // Admin
          this.router.navigate(['/admin']);
          break;
        case 2: // Organizer
          this.router.navigate(['/organizer']);
          break;
        case 3: // Dashboard
          this.router.navigate(['/dashboard']);
          break;
        default:
          console.error('Invalid role ID:', roleId);
          break;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      this.router.navigate(['/login']); // Redirect to login on error
    }
  }
}
