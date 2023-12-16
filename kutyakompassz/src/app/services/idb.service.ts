import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { Post } from '../models/post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IDBService {
  private db!: IDBPDatabase;
  posts: Post[] = [];
  postSubject: Subject<Post[]> = new Subject(); // Ezzel értesítheted a komponenseidet a változásokról

  constructor() {
    this.connectToDb();
  }

  async connectToDb() {
    this.db = await openDB('kutyakompassz', 1, {
      upgrade(db) {
        db.createObjectStore('posts');
      },
    });
    this.getPosts();
  }

  addPost(post: Post) {
    let posts = [];
    this.db.get('posts', 'posts').then((value) => {
      posts = value ? value : [];
      posts.push(post);
      this.db.put('posts', posts, 'posts');
    });
  }

  getPosts() {
    let posts: Post[] = [];
    this.db.get('posts', 'posts').then((value) => {
      posts = value ? value : [];
      this.posts = posts;
      this.postSubject.next(this.posts);
    });
  }

  removePost(post: Post) {
    let posts: Post[] = [];
    this.db.get('posts', 'posts').then((value) => {
      posts = value ? value : [];
      posts = posts.filter((p) => {
        return p.id !== post.id;
      });
      this.db.put('posts', posts, 'posts');
      this.getPosts();
    });
  }
}

