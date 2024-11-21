import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../services/meeting.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  meetings: any[] = [];

  constructor(private meetingService: MeetingService) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.meetingService.getMeetings().subscribe((data) => {
      this.meetings = data;
    });
  }
}
