import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, first } from 'rxjs';
import { StorageService } from './storage.service';
import { Post } from '../models/post.model';
import { forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Import the necessary package

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  public counter: number = 0;

  constructor(
    private afDatabase: AngularFireDatabase,
    private storageService: StorageService,
    private firestore: AngularFirestore
  ) {}

  private getNextId(): number {
    return ++this.counter;
  }

  addNewPost(post: Post, images: FileList | null) {
    post.id = this.getNextId();

    if (images && images.length > 0) {
      const imageObservables: Observable<string | null>[] = [];
      post.images = post.images.filter((url) => url !== null) as string[];
      this.savePost(post);
    } else {
      this.savePost(post);
    }
  }

  getPosts(): Observable<any[]> {
    return this.afDatabase.list('posts').valueChanges();
  }

  deletePost(postId: number) {
    if (!postId) {
      console.error('A rekordnak nincs egyedi azonosítója.');
      return;
    }

    const postsRef = this.afDatabase.list<Post>('posts', (ref) =>
      ref.orderByChild('id').equalTo(postId)
    );

    postsRef
      .snapshotChanges()
      .pipe(first())
      .subscribe((snapshotChanges) => {
        const key = snapshotChanges[0].key;
        console.log(snapshotChanges);

        if (key) {
          this.afDatabase
            .list('posts')
            .remove(key)
            .then(() => {
              console.log('Sikeresen törölve:', key);
            })
            .catch((error) => {
              console.error('Hiba történt a törlés során:', error);
            });
        } else {
          console.error('Nem található ilyen rekord az adatbázisban.');
        }
      });

    this.getPosts();
  }

  private savePost(post: Post) {
    this.afDatabase
      .list('posts')
      .push(post)
      .then((item) => {
        console.log('Sikeresen hozzáadva:', item.key, post.id);
      })
      .catch((error) => {
        console.error('Hiba történt:', error);
      });
  }
}
