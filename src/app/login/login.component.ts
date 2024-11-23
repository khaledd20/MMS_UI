import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    // Initialize the login form with reactive form controls and validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Submit the form to authenticate the user
  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
  
      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
  
          // Handle the login response
          this.authService.handleLoginResponse(response);
          
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = err.error?.message || 'Invalid email or password.';
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}
