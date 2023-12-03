import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Post } from '../models/post.model';
import { getDatabase, ref, set } from "firebase/database";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(private afDatabase: AngularFireDatabase) {}

  addNewPost(post: Post) {
    // Push a new record to the 'posts' path
    this.afDatabase.list('posts').push(post)
      .then((item) => {
        console.log('Sikeresen hozzáadva:', item.key);
      })
      .catch((error) => {
        console.error('Hiba történt:', error);
      });
  }

  getPosts(): Observable<any[]> {
    return this.afDatabase.list('posts').valueChanges();
  }
}
