import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  email: string = '';
  password: string = '';

  constructor(public auth: AngularFireAuth) {}

  register(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
  }
}
