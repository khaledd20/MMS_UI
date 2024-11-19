import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { JwtModule } from "@auth0/angular-jwt";
import { AdminComponent } from './admin/admin.component';
import { OrganizerComponent } from '../../organizer/organizer.component';//export function tokenGetter() {
//  return localStorage.getItem("tokkern");
//}
@NgModule({
  declarations: [		
    AppComponent,
    LoginComponent,
    DashboardComponent,
      AdminComponent,
      OrganizerComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
