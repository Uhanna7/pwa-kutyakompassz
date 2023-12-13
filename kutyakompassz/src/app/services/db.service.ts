import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Post } from '../models/post.model';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseService {

  constructor(
    private afDatabase: AngularFireDatabase,
    private storageService: StorageService
  ) {}

  addNewPost(post: Post, images: FileList | null) {
    // Ha vannak képek, töltse fel őket a Firebase Storage-be
    if (images && images.length > 0) {
      const imageObservables: Observable<string | null>[] = [];

      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        if (imageFile) {
          const imageObservable = this.storageService.uploadImage(imageFile, 'posts');
          imageObservables.push(imageObservable);
        }
      }

      // Ha minden kép feltöltése befejeződött, mentse a posztot az adatbázisba
      forkJoin(imageObservables).subscribe(
        downloadURLs => {
          console.log("itt vagyok"),
          // A downloadURLs tartalmazza a feltöltött képek letölthető URL-jét
          post.images = downloadURLs.filter(url => url !== null) as string[];
          this.savePost(post);
        },
        error => {
          console.error('Error uploading images:', error);
        }
      );
    } else {
      // Ha nincsenek képek, mentse a posztot az adatbázisba
      this.savePost(post);
    }
  }

  private savePost(post: Post) {
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
