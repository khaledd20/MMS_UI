import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendeesService } from '../services/attendees.service'; 

@Component({
  selector: 'app-attendees',
  templateUrl: './attendees.component.html',
  styleUrls: ['./attendees.component.scss'],
})
export class AttendeesComponent implements OnInit {
  attendees: any[] = [];
  meetingId: number | null = null;
  attendeeForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private attendeesService: AttendeesService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.attendeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.meetingId = this.route.snapshot.params['id'];
    if (this.meetingId) {
      this.loadAttendees();
    }
  }

  // Load attendees for the meeting
  loadAttendees(): void {
    if (this.meetingId) {
      this.attendeesService.getAttendees(this.meetingId).subscribe({
        next: (data) => (this.attendees = data),
        error: (err) => {
          this.errorMessage = 'Failed to load attendees.';
          console.error(err);
        },
      });
    }
  }

  // Add a new attendee
  addAttendee(): void {
    if (this.attendeeForm.valid && this.meetingId) {
      this.attendeesService.addAttendee(this.meetingId, this.attendeeForm.value).subscribe({
        next: (attendee) => {
          this.attendees.push(attendee);
          this.attendeeForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add attendee.';
          console.error(err);
        },
      });
    }
  }

  // Remove an attendee
  removeAttendee(attendeeId: number): void {
    if (this.meetingId) {
      this.attendeesService.removeAttendee(this.meetingId, attendeeId).subscribe({
        next: () => {
          this.attendees = this.attendees.filter((a) => a.id !== attendeeId);
        },
        error: (err) => {
          this.errorMessage = 'Failed to remove attendee.';
          console.error(err);
        },
      });
    }
  }
}
