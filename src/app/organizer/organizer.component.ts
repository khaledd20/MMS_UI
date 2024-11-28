import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  meetings: any[] = [];
  organizerId: number | null = null;

  constructor(private meetingService: MeetingService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.organizerId = currentUser.userId; // Get the organizer ID of the logged-in user
      this.loadMeetings();
    } else {
      console.error('Failed to retrieve current user information.');
    }
  }

  loadMeetings(): void {
  if (this.organizerId) {
    this.meetingService.getMeetingsByOrganizer(this.organizerId).subscribe({
      next: (data) => {
        console.log('Meetings loaded for organizer:', data); // Debugging
        this.meetings = data; // Ensure all meetings are assigned to the list
      },
      error: (err) => {
        console.error('Failed to load meetings:', err);
      },
    });
  } else {
    console.error('Organizer ID is null. Unable to load meetings.');
  }
}


  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      console.log('Attempting to delete meeting with ID:', id);

      this.meetingService.deleteMeeting(id).subscribe({
        next: () => {
          this.meetings = this.meetings.filter((meeting) => meeting.meetingId !== id);
          console.log('Meeting deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete meeting:', err.message || err);
        },
      });
    }
  }
}
