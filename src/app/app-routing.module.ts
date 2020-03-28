import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TraceComponent } from './trace/trace.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'trace', component: TraceComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
