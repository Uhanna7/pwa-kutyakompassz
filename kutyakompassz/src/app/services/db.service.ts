import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Post } from '../models/post.model';
import { forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Import the necessary package

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  private counter: number = 0;

  constructor(
    private afDatabase: AngularFireDatabase,
    private storageService: StorageService,
    private firestore: AngularFirestore,
  ) {}

  private getNextId(): number {
    return ++this.counter;
  }

  addNewPost(post: Post, images: FileList | null) {
    post.id = this.getNextId();

    if (images && images.length > 0) {
      const imageObservables: Observable<string | null>[] = [];

      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        if (imageFile) {
          const imageObservable = this.storageService.uploadImage(imageFile, 'posts');
          imageObservables.push(imageObservable);
        }
      }

      forkJoin(imageObservables).subscribe(
        downloadURLs => {
          post.images = downloadURLs.filter(url => url !== null) as string[];
          this.savePost(post);
        },
        error => {
          console.error('Error uploading images:', error);
        }
      );
    } else {
      this.savePost(post);
    }
  }

  private savePost(post: Post) {
    this.afDatabase.list('posts').push(post)
      .then((item) => {
        console.log('Sikeresen hozzáadva:', item.key, post.id);
      })
      .catch((error) => {
        console.error('Hiba történt:', error);
      });
  }

  getPosts(): Observable<any[]> {
    return this.afDatabase.list('posts').valueChanges();
  }
}
