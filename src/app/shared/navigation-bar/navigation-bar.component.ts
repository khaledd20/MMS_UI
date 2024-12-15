import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn: boolean = false; // Track login status
  permissions: string[] = [];  // Store permissions for the logged-in user

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the login status
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      if (status) {
        // Fetch and set permissions when the user is logged in
        this.authService.permissions$.subscribe((perms) => {
          this.permissions = perms || [];
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
