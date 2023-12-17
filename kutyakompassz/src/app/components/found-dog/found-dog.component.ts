import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { IDBService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-found-dog',
  templateUrl: './found-dog.component.html',
  styleUrls: ['./found-dog.component.scss'],
})
export class FoundDogComponent implements OnInit {
  isAdmin = false;
  isPhonePortrait = false;
  posts: Post[] = [];
  type = 'found';

  isOnline: boolean;

  user: any;

  constructor(
    private responsive: BreakpointObserver,
    private dbService: DatabaseService,
    private idbService: IDBService,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog
  ) {
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.handleOnlineStatusChange());
    window.addEventListener('offline', () => this.handleOnlineStatusChange());
  }

  ngOnInit() {
    this.isAdmin = false;

    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
      this.isPhonePortrait = false;

      if (result.matches) {
        this.isPhonePortrait = true;
      }
    });

    this.afAuth.authState.subscribe((user) => {
      this.user = user;
      this.adminRole();
    });

    this.loadPosts();
  }

  onPostDeleted(post: Post) {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].id === post.id) {
        this.posts.splice(i, 1);
      }
    }
  }

  loadPosts() {
    if (this.isOnline) {
      this.dbService.getPosts().subscribe((data) => {
        this.posts = [];
        this.dbService.counter = data.length;

        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 'found') {
            this.posts.unshift(data[i]);
          }
          this.posts = this.posts;
        }
      });

      console.log(this.posts);
    }

    if (!this.isOnline) {
      console.log('offline');
      this.idbService.postSubject.subscribe((posts) => {
        this.posts = [];

        for (let i = 0; i < posts.length; i++) {
          if (posts[i].type === 'found') {
            this.posts.push(posts[i]);
          }
        }
      });
    }
  }

  openAuthDialog() {
    const dialogRef = this.dialog.open(AuthDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed', result);
    });
  }

  adminRole() {
    if (this.user && this.user.email === 'admin@admin.com') {
      this.isAdmin = true;
    }
  }

  private handleOnlineStatusChange(): void {
    this.isOnline = navigator.onLine;
  }
}
