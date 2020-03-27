import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TraceComponent } from './trace/trace.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';


const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'trace', component: TraceComponent},
  { path: 'admin', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
