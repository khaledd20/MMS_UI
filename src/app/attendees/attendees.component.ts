import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendeesService } from '../services/attendees.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss'],
})
export class AttendeesComponent implements OnInit {
  attendees: any[] = []; // List of attendees
  meetingId: number | null = null; // Current meeting ID
  errorMessage: string = ''; // For error messages
  successMessage: string = ''; // For success messages
  attendeeForm: FormGroup; // Form for adding an attendee
  searchResults: any[] = []; // Search results for users
  isSearching: boolean = false; // Indicates if a search is ongoing
  permissions: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private attendeesService: AttendeesService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    // Initialize the attendee form
    this.attendeeForm = this.fb.group({
      query: ['', Validators.required], // Search query for user
    });
  }

  ngOnInit(): void {
    // Get the meeting ID from the route parameters
    this.authService.permissions$.subscribe((permissions) => {
      this.permissions = permissions;
    });
    this.meetingId = +this.route.snapshot.paramMap.get('meetingId')!;
    console.log(`Meeting ID from URL: ${this.meetingId}`); // Debug log
    if (this.meetingId) {
      this.loadAttendees(); // Load attendees for the meeting
    } else {
      this.errorMessage = 'Meeting ID is required.';
    }
  }

  // Load attendees for the current meeting
  loadAttendees(): void {
    if (this.meetingId) {
      this.attendeesService.getAttendees(this.meetingId).subscribe({
        next: (attendees) => {
          this.attendees = attendees;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load attendees.';
          console.error(err);
        },
      });
    }
  }

  // Search for users
  searchUsers(): void {
    const query = this.attendeeForm.get('query')?.value;

    if (!query) {
      this.errorMessage = 'Please enter a valid query.';
      return;
    }

    this.isSearching = true;

    this.attendeesService.searchUsers(query).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isSearching = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to search for users.';
        this.isSearching = false;
        console.error(err);
      },
    });
  }

  // Add a new attendee
  addAttendee(userId: number): void {
    if (!this.meetingId) {
      this.errorMessage = 'Meeting ID is required.';
      return;
    }
  
    const payload = { userId }; // Correct payload structure
  
    console.log('Sending payload:', payload);
  
    this.attendeesService.addAttendee(this.meetingId, payload).subscribe({
      next: (newAttendee) => {
        this.attendees.push(newAttendee);
        this.successMessage = 'Attendee added successfully.';
        this.searchResults = [];
        this.attendeeForm.reset();
      },
      error: (err) => {
        if (err.status === 400) {
          this.errorMessage = 'Invalid user or meeting data.';
        } else if (err.status === 404) {
          this.errorMessage = 'Meeting not found.';
        } else if (err.status === 409) {
          this.errorMessage = 'User is already an attendee.';
        } else {
          this.errorMessage = 'Failed to add attendee.';
        }
        console.error('Error adding attendee:', err);
      },
    });
  }
  


  // Remove an attendee
  removeAttendee(attendeeId: number): void {
    if (this.meetingId) {
      this.attendeesService.removeAttendee(this.meetingId, attendeeId).subscribe({
        next: () => {
          this.attendees = this.attendees.filter((a) => a.id !== attendeeId); // Remove the attendee from the list
          this.successMessage = 'Attendee removed successfully.';
        },
        error: (err) => {
          this.errorMessage = 'Failed to remove attendee.';
          console.error(err);
        },
      });
    }
  }
}
