import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { User } from "../services/user";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentUser: User = null;

  constructor(public authService: AuthService) {
   }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.authService.getUserData());
  }

  signOut() {
    console.log('signing out')
    this.authService.signOut();
  }

}
