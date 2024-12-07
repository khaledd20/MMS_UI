import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private baseUrl = `${environment.APIBaseURL}/meetings`;

  constructor(private http: HttpClient) {}

  getMeetings(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getMeetingById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getMeetingsByOrganizer(organizerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organizer/${organizerId}`);
  }

  createMeeting(meeting: any): Observable<any> {
    const { meetingId, ...payload } = meeting; // Exclude meetingId from payload
    return this.http.post<any>(this.baseUrl, payload);
  }

  updateMeeting(id: number, meeting: any): Observable<any> {
    // Exclude 'attendees' from the meeting payload
    const { attendees, ...cleanedPayload } = meeting;
  
    return this.http.put<any>(`${this.baseUrl}/${id}`, cleanedPayload);
  }
  

  deleteMeeting(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
