import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roleId: ['', [Validators.required]], // Role selection
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const registrationData = this.registrationForm.value;
  
      this.authService.register(registrationData).subscribe({
        next: () => {
          console.log('Registration successful');
          
          // Assume success if no error is thrown
          this.successMessage = 'Registration completed successfully!';
          this.errorMessage = '';
  
          // Redirect to login after showing success message
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          console.error('Registration failed:', err);
  
          if (err.status === 409) {
            this.errorMessage = err.error || 'Email is already registered.';
          } else {
            this.errorMessage = err.error || 'Registration failed. Please try again.';
          }
          this.successMessage = ''; // Clear success message
        },
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.successMessage = '';
    }
  }
}  
