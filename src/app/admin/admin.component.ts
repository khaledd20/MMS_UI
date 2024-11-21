import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../services/meeting.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  meetings: any[] = [];
  permissions: string[] = [];

  constructor(private meetingService: MeetingService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.permissions$.subscribe((permissions) => {
      this.permissions = permissions;
    });
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.meetingService.getMeetings().subscribe({
      next: (data) => {
        this.meetings = data;
      },
      error: (err) => {
        console.error('Failed to load meetings:', err);
      },
    });
  }

  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.meetingService.deleteMeeting(id).subscribe({
        next: () => {
          this.meetings = this.meetings.filter((meeting) => meeting.id !== id);
          console.log('Meeting deleted successfully.');
        },
        error: (err) => {
          console.error('Failed to delete meeting:', err);
        },
      });
    }
  }
  
}
