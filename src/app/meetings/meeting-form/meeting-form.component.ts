import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingService } from '../../services/meeting.service';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-meeting-form',
  templateUrl: './meeting-form.component.html',
  styleUrls: ['./meeting-form.component.scss'],
})
export class MeetingFormComponent implements OnInit {
  meetingForm: FormGroup;
  meetingId: number | null = null; // Store meeting ID for editing
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location ,

  ) {
    // Initialize the form
    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      status: ['Assigned', Validators.required],
      description: [''],
      organizerId: ['', Validators.required], // Add organizerId to the form

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
          organizerId:meeting.organizerId,
        });
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load meeting details.';
        console.error(err);
      },
    });
  }

  // Handle Create Meeting
  createMeeting(): void {
    if (!this.meetingForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    const meetingData = this.meetingForm.value;
  
    // Get the current user dynamically
    const currentUser = this.authService.getCurrentUser();
  
    if (!currentUser || !currentUser.userId) {
      this.errorMessage = 'User not logged in. Please log in to continue.';
      return;
    }
  
    const payload = {
      ...meetingData,
      organizerId: currentUser.userId, // Dynamically use the logged-in user's ID
    };
  
    this.meetingService.createMeeting(payload).subscribe({
      next: () => {
        console.log('Meeting created successfully.');
        this.location.back();
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to create meeting.';
        console.error('Error from create API:', err);
      },
    });
  }
  
  

  // Handle Update Meeting dynamically
  /*updateMeeting(): void {
    if (!this.meetingForm.valid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
  
    if (!this.meetingId) {
      this.errorMessage = 'No meeting ID provided for update.';
      return;
    }
  
    const meetingData = this.meetingForm.value;
    const currentUser = this.authService.getCurrentUser();
  
    if (!currentUser || !currentUser.userId) {
      this.errorMessage = 'User not logged in. Please log in to continue.';
      return;
    }
  
    const payload = {
      meetingId: this.meetingId,
      ...meetingData,
      organizerId: currentUser.userId, // Use dynamic organizer ID
    };
  
    this.meetingService.updateMeeting(this.meetingId, payload).subscribe({
      next: () => {
        console.log('Meeting updated successfully.');
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to update meeting.';
        console.error('Error from update API:', err);
      },
    });
  }*/
    updateMeeting(): void {
      if (!this.meetingForm.valid) {
        this.errorMessage = 'Please fill in all required fields correctly.';
        return;
      }
    
      if (!this.meetingId) {
        this.errorMessage = 'No meeting ID provided for update.';
        return;
      }
    
      const meetingData = this.meetingForm.value;
    
      // Include the manually set organizerId from the form
      const payload = {
        meetingId: this.meetingId,
        ...meetingData, // Includes organizerId from the form
      };
    
      this.meetingService.updateMeeting(this.meetingId, payload).subscribe({
        next: () => {
          console.log('Meeting updated successfully.');
          this.location.back();
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to update meeting.';
          console.error('Error from update API:', err);
        },
      });
    }
    
  
  
}
