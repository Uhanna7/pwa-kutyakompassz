import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  autoLogoutOnPageClose() {
    window.addEventListener('beforeunload', () => {
      // Itt ellenőrizd a Firebase Auth állapotát
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          // Ha be van jelentkezve, akkor kijelentkezés
          this.afAuth.signOut();
        }
      });
    });
  }
}
