import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatabaseService } from 'src/app/services/db.service';
import { Post } from 'src/app/models/post.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  @Input() post: Post = {
    id: 0,
    title: '',
    description: '',
    date: '',
    location: '',
    type: '',
    userId: '',
    images: [],
  };
  
  images!: string[];

  isPhonePortrait = false;

  user: any;
  
  constructor(
    private responsive: BreakpointObserver,
    private databaseService: DatabaseService,
    private afAuth: AngularFireAuth,
  ) {}

  ngOnInit() {

    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
        this.isPhonePortrait = false; 
        if (result.matches) {
          this.isPhonePortrait = true;
        }
    });

    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });

    this.images = this.post.images;
  }

  deletePost() {
    //this.databaseService.deletePost(this.post.id);
  }
}
