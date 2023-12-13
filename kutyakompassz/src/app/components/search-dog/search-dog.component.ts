import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';
import { AuthDialogComponent } from '../auth/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-search-dog',
  templateUrl: './search-dog.component.html',
  styleUrls: ['./search-dog.component.scss']
})
export class SearchDogComponent {
  isPhonePortrait = false;
  posts: Post[] = [];
  type = 'search';

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
    this.dbService.getPosts().subscribe((data) => {
      for(let i = 0; i < data.length; i++) {
        if(data[i].type === 'search') {
          this.posts.push(data[i]);
        }
      }
    });
  }

  openAuthDialog() {
    const dialogRef = this.dialog.open(AuthDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }


}
