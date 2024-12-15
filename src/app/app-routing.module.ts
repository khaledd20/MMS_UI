import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ParticipantComponent } from './participant/participant.component';
import { AdminComponent } from './admin/admin.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { RegistrationComponent } from './registration/registration.component';
import { MeetingListComponent } from './meetings/meeting-list/meeting-list.component';
import { MeetingFormComponent } from './meetings/meeting-form/meeting-form.component';
import { AuthGuard } from './services/auth.guard';
import { AttendeesComponent } from './attendees/attendees.component';
import { MeetingMinutesComponent } from './meeting.minutes/meeting.minutes.component';
import { ProfileComponent } from './profile/profile.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'participant', 
    component: ParticipantComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'View Participant Dashboard' } 
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'View Admin Dashboard' }
  },
  { 
    path: 'organizer', 
    component: OrganizerComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'View Organizer Dashboard' }
  },
  { path: 'register', component: RegistrationComponent },
  { 
    path: 'meetings', 
    component: MeetingListComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'View Meetings' }
  },
  { 
    path: 'meetings/new', 
    component: MeetingFormComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'Create Meetings' }
  },
  { 
    path: 'meetings/:id/edit', 
    component: MeetingFormComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'Edit Meetings' }
  },
  { 
    path: 'meetings/:meetingId/attendees', 
    component: AttendeesComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'View Attendee' }
  },
  { 
    path: 'minutes/:meetingId/minutes', 
    component: MeetingMinutesComponent,
    canActivate: [AuthGuard],
    data: { permission: 'View Minute M' }
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-management', 
    component: UserManagementComponent, 
    canActivate: [AuthGuard],
    data: { permission: 'Manage Users' }
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
