import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { OrganizerComponent } from './organizer/organizer.component';//export function tokenGetter() {
import { RegistrationComponent } from './registration/registration.component';
import { MeetingFormComponent } from './meetings/meeting-form/meeting-form.component';
import { MeetingListComponent } from './meetings/meeting-list/meeting-list.component';
import { ParticipantComponent } from './participant/participant.component';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { AttendeesComponent } from './attendees/attendees.component';
import { MeetingMinutesComponent } from './meeting.minutes/meeting.minutes.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [			
    AppComponent,
    LoginComponent,
    ParticipantComponent,
    AdminComponent,
    OrganizerComponent,
    RegistrationComponent,
    MeetingFormComponent,
    MeetingListComponent,
    NavigationBarComponent,
    AttendeesComponent,
    MeetingMinutesComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
