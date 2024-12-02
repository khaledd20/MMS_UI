import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  currentUser: any;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]], // Optional password field
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // Fetch user details from the AuthService
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email,
        
      });
    } else {
      console.error('Failed to fetch user details.');
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const updatedData = {
      userId: this.currentUser.userId,
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value,
      password: this.profileForm.get('password')?.value || null,
    };
    
    console.log('Payload Sent:', updatedData);
    
    

    this.authService.updateUser(updatedData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.errorMessage = '';
        this.loadCurrentUser(); // Reload the updated data
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.errorMessage = 'Failed to update profile. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
