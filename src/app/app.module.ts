import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';


import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TraceComponent } from './trace/trace.component';
import { HomeComponent } from './home/home.component';
import { ReportDialogueComponent } from './trace/report-dialogue/report-dialogue.component'
import { AppService } from './app.service';
import { AuthService } from "./services/auth.service";
import { InstructionsComponent } from './instructions/instructions.component';
import { AdminComponent } from './admin/admin.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { SigninFormComponent } from './admin/signin-form/signin-form.component';
import { AddpatientFormComponent } from './admin/addpatient-form/addpatient-form.component';

import * as geolib from 'geolib';

@NgModule({
  declarations: [
    AppComponent,
    TraceComponent,
    HomeComponent,
    ReportDialogueComponent,
    InstructionsComponent,
    AdminComponent,
    PrivacyComponent,
    ContactComponent,
    SigninFormComponent,
    AddpatientFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatCardModule
  ],
  providers: [AppService, AngularFirestore, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
