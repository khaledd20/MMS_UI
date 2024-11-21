import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ParticipantComponent } from './participant/participant.component';
import { AdminComponent } from './admin/admin.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { RegistrationComponent } from './registration/registration.component';
import { MeetingListComponent } from './meetings/meeting-list/meeting-list.component';
import { MeetingFormComponent } from './meetings/meeting-form/meeting-form.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'participant', component: ParticipantComponent},
  { path: 'admin', component: AdminComponent },
  { path: 'organizer', component: OrganizerComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'meetings', component: MeetingListComponent },
  { path: 'meetings/new', component: MeetingFormComponent },
  { path: 'meetings/:id/edit', component: MeetingFormComponent },
  { path: '', redirectTo: '/meetings', pathMatch: 'full' },
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
