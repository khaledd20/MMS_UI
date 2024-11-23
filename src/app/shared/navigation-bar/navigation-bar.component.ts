import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login status
  userRole: number | null = null; // Store the user's role ID

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to authentication status
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (status) {
        // Fetch the user's role if logged in
        const currentUser = this.authService.getCurrentUser();
        this.userRole = currentUser?.roleId || null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // Refresh the page
  }
}
