import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-found-dog',
  templateUrl: './found-dog.component.html',
  styleUrls: ['./found-dog.component.scss'],
})
export class FoundDogComponent implements OnInit {
  isPhonePortrait = false;
  posts: Post[] = [];
  type = 'found';

  user: any;

  constructor(
    private responsive: BreakpointObserver,
    private dbService: DatabaseService,
    private afAuth: AngularFireAuth,
    public dialog: MatDialog
  ) {}

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
    this.dbService.getPosts().subscribe((data) => {
      for(let i = 0; i < data.length; i++) {
        if(data[i].type === 'found') {
          this.posts.push(data[i]);
        }
      }
    });
  }

  clearPosts() {
    for(let i = 0; i < this.posts.length; i++) {
      if(this.posts[i].type === 'search') {
        this.posts.splice(i, 1);
      }
    }
  }

  openAuthDialog() {
    const dialogRef = this.dialog.open(AuthDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

}

