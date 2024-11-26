import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MeetingMinutesService {
  private baseUrl = `${environment.APIBaseURL}/meetings`;

  constructor(private http: HttpClient) {}

  getMinutes(meetingId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${meetingId}/minutes`);
  }

  addMinute(meetingId: number, minute: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${meetingId}/minutes`, minute);
  }

  updateMinute(meetingId: number, minuteId: number, minute: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${meetingId}/minutes/${minuteId}`, minute);
  }

  deleteMinute(meetingId: number, minuteId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${meetingId}/minutes/${minuteId}`);
  }
}
