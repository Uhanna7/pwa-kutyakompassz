import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';
import { IDBService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-search-dog',
  templateUrl: './search-dog.component.html',
  styleUrls: ['./search-dog.component.scss']
})
export class SearchDogComponent {
  isPhonePortrait = false;
  posts: Post[] = [];
  type = 'search';

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
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
      this.isPhonePortrait = false;

      if (result.matches) {
        this.isPhonePortrait = true;
      }
    });

    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });

    this.loadPosts();
  }

  loadPosts() {
    this.posts = [];

    if(this.isOnline) {
      this.dbService.getPosts().subscribe((data) => {
        for(let i = 0; i < data.length; i++) {
          if(data[i].type === 'search') {
            this.posts.push(data[i]);
          }
        }
        console.log(this.posts);
      });
    }

    if(!this.isOnline) {
       this.idbService.postSubject.subscribe((posts) => {
        for(let i = 0; i < posts.length; i++) {
          if(posts[i].type === 'search') {
            this.posts.push(posts[i]);
          }
        }
      });
    }
  }

  openAuthDialog() {
    const dialogRef = this.dialog.open(AuthDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  private handleOnlineStatusChange(): void {
    this.isOnline = navigator.onLine;
  }
}
