import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MeetingMinutesService } from '../services/meeting.minutes.service';

@Component({
  selector: 'app-meeting-minutes',
  templateUrl: './meeting.minutes.component.html',
  styleUrls: ['./meeting.minutes.component.scss'],
})
export class MeetingMinutesComponent implements OnInit {
  minutes: any[] = [];
  meetingId: number | null = null;
  minuteForm: FormGroup;
  isEditing: boolean = false; // Track if editing an existing minute
  editingMinuteId: number | null = null; // Store the ID of the minute being edited
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private minutesService: MeetingMinutesService
  ) {
    this.minuteForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.meetingId = +this.route.snapshot.paramMap.get('meetingId')!;
    if (this.meetingId) {
      this.loadMinutes();
    } else {
      this.errorMessage = 'Meeting ID is required.';
    }
  }

  // Load minutes for the current meeting
  loadMinutes(): void {
    if (this.meetingId) {
      this.minutesService.getMinutes(this.meetingId).subscribe({
        next: (data) => {
          this.minutes = data;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load meeting minutes.';
          console.error(err);
        },
      });
    }
  }

  // Save (Add or Update) a minute
  saveMinute(): void {
    if (!this.meetingId) {
      this.errorMessage = 'Meeting ID is required.';
      return;
    }

    const content = this.minuteForm.get('content')?.value;

    if (this.isEditing && this.editingMinuteId !== null) {
      // Update existing minute
      this.minutesService
        .updateMinute(this.meetingId, this.editingMinuteId, { content })
        .subscribe({
          next: (updatedMinute) => {
            const index = this.minutes.findIndex(
              (m) => m.minuteId === this.editingMinuteId
            );
            this.minutes[index] = updatedMinute; // Update the list
            this.successMessage = 'Minute updated successfully.';
            this.resetForm();
          },
          error: (err) => {
            this.errorMessage = 'Failed to update minute.';
            console.error(err);
          },
        });
    } else {
      // Add new minute
      this.minutesService.addMinute(this.meetingId, { content }).subscribe({
        next: (newMinute) => {
          this.minutes.push(newMinute);
          this.successMessage = 'Minute added successfully.';
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = 'Failed to add minute.';
          console.error(err);
        },
      });
    }
  }

  // Edit an existing minute
  editMinute(minute: any): void {
    this.isEditing = true;
    this.editingMinuteId = minute.minuteId;
    this.minuteForm.patchValue({ content: minute.content });
  }

  // Delete a minute
  deleteMinute(minuteId: number): void {
    if (this.meetingId) {
      this.minutesService.deleteMinute(this.meetingId, minuteId).subscribe({
        next: () => {
          this.minutes = this.minutes.filter((m) => m.minuteId !== minuteId); // Remove from the list
          this.successMessage = 'Minute deleted successfully.';
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete minute.';
          console.error(err);
        },
      });
    }
  }

  // Reset form and editing state
  resetForm(): void {
    this.isEditing = false;
    this.editingMinuteId = null;
    this.minuteForm.reset();
  }
}
