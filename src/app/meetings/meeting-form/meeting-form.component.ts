import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss']
})
export class MeetingFormComponent implements OnInit {
  meetingForm: FormGroup;
  meetingId: number | null = null; // Store meeting ID for editing
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the form
    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Assigned', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    // Get the meeting ID from the route if editing
    this.meetingId = this.route.snapshot.params['id'];
    if (this.meetingId) {
      this.loadMeetingDetails();
    }
  }

  // Load meeting details for editing
  loadMeetingDetails(): void {
    this.meetingService.getMeetingById(this.meetingId!).subscribe({
      next: (meeting: any) => {
        this.meetingForm.patchValue({
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          status: meeting.status,
          description: meeting.description,
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load meeting details.';
        console.error(err);
      },
    });
  }

  // Submit form (Create or Update)
  onSubmit(): void {
    if (this.meetingForm.valid) {
      const meetingData = this.meetingForm.value;
  
      if (this.meetingId) {
        console.log('Editing Meeting with Data:', meetingData); // Debug log
        this.meetingService.updateMeeting(this.meetingId, meetingData).subscribe({
          next: () => {
            console.log('Meeting updated successfully.');
            this.router.navigate(['/admin']);
          },
          error: (err: any) => {
            this.errorMessage = 'Failed to update meeting.';
            console.error('Error from update API:', err); // Debug log
          },
        });
      } else {
        // Add organizerId dynamically
        const meetingToCreate = {
          ...meetingData,
          organizerId: 2, // Replace '2' with dynamic user ID if available from auth
        };
  
        console.log('Creating New Meeting with Data:', meetingToCreate); // Debug log
        this.meetingService.createMeeting(meetingToCreate).subscribe({
          next: () => {
            console.log('Meeting created successfully.');
            this.router.navigate(['/admin']);
          },
          error: (err: any) => {
            this.errorMessage = 'Failed to create meeting.';
            console.error('Error from create API:', err); // Debug log
          },
        });
      }
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}  