import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { TraceComponent } from './trace/trace.component';
import { HomeComponent } from './home/home.component';
import { ReportDialogueComponent } from './trace/report-dialogue/report-dialogue.component'
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    TraceComponent,
    HomeComponent,
    ReportDialogueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatInputModule
  ],
  providers: [AppService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
