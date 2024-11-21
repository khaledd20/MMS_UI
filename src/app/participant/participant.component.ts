import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../services/meeting.service';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss'],
})
export class ParticipantComponent implements OnInit {
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
