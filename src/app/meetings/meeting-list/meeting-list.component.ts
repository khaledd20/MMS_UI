import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  meetings: any[] = [];
  errorMessage: string = '';

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.meetingService.getMeetings().subscribe({
      next: (data) => {
        this.meetings = data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load meetings.';
        console.error(err);
      },
    });
  }

  deleteMeeting(id: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.meetingService.deleteMeeting(id).subscribe({
        next: () => {
          this.meetings = this.meetings.filter((meeting) => meeting.id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete meeting.';
          console.error(err);
        },
      });
    }
  }
}
