import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatabaseService } from 'src/app/services/db.service';
import { Post } from 'src/app/models/post.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IDBService } from 'src/app/services/idb.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post: Post = {
    id: '',
    title: '',
    description: '',
    date: '',
    location: '',
    type: '',
    userId: '',
    images: [],
  };

  @Output() deletePost: EventEmitter<Post>;
  
  images!: string[];

  isPhonePortrait = false;

  isOnline: boolean;

  user: any;
  
  constructor(
    private responsive: BreakpointObserver,
    private databaseService: DatabaseService,
    private idbService: IDBService,
    private afAuth: AngularFireAuth,
  ) {
    this.deletePost = new EventEmitter<Post>();
    this.isOnline = navigator.onLine;
    window.addEventListener('online', () => this.handleOnlineStatusChange());
    window.addEventListener('offline', () => this.handleOnlineStatusChange());
  }

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

  onDeletePost(post: Post) {
    if(!post.id || !this.isOnline) {
      console.log("Offline módban nem lehet törölni!")
      return;
    }
    this.databaseService.deletePost(post.id);
    this.idbService.removePost(post);

    this.deletePost.emit(post);
  }

  private handleOnlineStatusChange(): void {
    this.isOnline = navigator.onLine;
  }
}
