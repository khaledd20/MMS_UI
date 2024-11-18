import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Include FormsModule here
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  login() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // Add your login logic here
  }
}
/*
  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe(
      (response) => {
        const token = response.Bearer; // Assuming the token is in the 'Bearer' field
        localStorage.setItem('authToken', token); // Save token to localStorage
        this.router.navigate(['/dashboard']); // Redirect to a dashboard or another page
      },
      (error) => {
        this.errorMessage = 'Invalid email or password.';
        console.error('Login error:', error);
      }
    );
  }
}
*/