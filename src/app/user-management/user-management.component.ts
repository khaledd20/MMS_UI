import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  isEditing: boolean = false;
  editingUserId: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private http: HttpClient) {
    // Initialize the form
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)], // Optional password field
      roleId: [2, Validators.required], // Default role (Organizer)
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load all users
  loadUsers(): void {
    const token = localStorage.getItem('authToken'); // Get the JWT token
    const headers = { Authorization: `Bearer ${token}` }; // Add the token to the request headers
  
    this.http.get<any[]>('http://localhost:5265/auth/users', { headers }).subscribe({
      next: (users) => {
        this.users = users; // Assign the retrieved users to the component variable
        this.errorMessage = ''; // Clear any error messages
      },
      error: (err) => {
        console.error('Failed to load users:', err); // Log the error for debugging
        this.errorMessage = 'Failed to load users.'; // Display the error message
      },
    });
  }
  

  // Add or update a user
  saveUser(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    const userData = this.userForm.value;
    console.log('User Data:', userData);
  
    if (this.isEditing && this.editingUserId) {
      // Update existing user
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };
  
      // Ensure roleId is an integer
      const roleId = parseInt(userData.roleId, 10);
  
      // Update general user data
      this.http.put(`http://localhost:5265/auth/users/${this.editingUserId}`, userData, { headers }).subscribe({
        next: () => {
          // Update the role if it has changed
          if (roleId) {
            this.http
              .put(`http://localhost:5265/auth/users/${this.editingUserId}/role`, roleId, { headers })
              .subscribe({
                next: () => {
                  this.successMessage = 'User updated successfully, including role.';
                  this.errorMessage = '';
                  this.resetForm();
                  this.loadUsers(); // Refresh the user list
                },
                error: (err) => {
                  console.error('Failed to update user role:', err);
                  this.errorMessage = 'Failed to update user role.';
                },
              });
          } else {
            this.successMessage = 'User updated successfully.';
            this.errorMessage = '';
            this.resetForm();
            this.loadUsers(); // Refresh the user list
          }
        },
        error: (err) => {
          console.error('Failed to update user:', err);
          this.errorMessage = 'Failed to update user.';
        },
      });
    } else {
      // Create new user
      this.http.post('http://localhost:5265/auth/register', userData).subscribe({
        next: () => {
          this.successMessage = 'User created successfully.';
          this.errorMessage = '';
          this.resetForm();
          this.loadUsers();
        },
        error: (err) => {
          console.error('Failed to create user:', err);
          this.errorMessage = 'Failed to create user.';
        },
      });
    }
  }
  

  // Edit user
  editUser(user: any): void {
    this.isEditing = true;
    this.editingUserId = user.userId;
  
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: user.password, // Prefill the password
      roleId: user.roleId,
    });
  }
  

  // Delete user
  deleteUser(userId: number): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.delete(`http://localhost:5265/auth/users/${userId}`, { headers }).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully.';
        this.errorMessage = '';
        this.loadUsers();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
        this.errorMessage = 'Failed to delete user.';
      },
    });
  }

  // Reset the form
  resetForm(): void {
    this.userForm.reset({
      name: '',
      email: '',
      password: '',
      roleId: 2, // Default role (Organizer)
    });
    this.isEditing = false;
    this.editingUserId = null;
  }
}
