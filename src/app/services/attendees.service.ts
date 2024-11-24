import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendeesService {
  private baseUrl = `${environment.APIBaseURL}/meetings`;

  constructor(private http: HttpClient) {}

  // Get attendees for a meeting
  getAttendees(meetingId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${meetingId}/attendees`);
  }

  // Add an attendee to a meeting
  addAttendee(meetingId: number, attendee: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${meetingId}/attendees`, attendee);
  }

  // Remove an attendee from a meeting
  removeAttendee(meetingId: number, attendeeId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${meetingId}/attendees/${attendeeId}`);
  }
}
