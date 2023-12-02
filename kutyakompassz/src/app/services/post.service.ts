// firestore.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private db: AngularFireDatabase) {}

  // Új poszt létrehozása a Realtime Database-ben
  createPost(title: string, description: string) {
    const postId = this.db.list('posts').push({
      title,
      description,
      creationDate: new Date().toISOString(),
    }).key;
    return postId;
  }

  // Posztok lekérése a Realtime Database-ből
  getPosts() {
    return this.db.list('posts').valueChanges();
  }
}
