import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  signIn(email: string, password: string) {
    this.authService.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("user signed in")
        this.currentUser = JSON.parse(this.authService.getUserData());
      });
  }

  signOut() {
    console.log('signing out')
    this.authService.signOut();
  }

}
