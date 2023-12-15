import { Component, Input, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatabaseService } from 'src/app/services/db.service';
import { Post } from 'src/app/models/post.model';

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
  
  constructor(private responsive: BreakpointObserver, private databaseService: DatabaseService) {}

  ngOnInit() {
    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {
        this.isPhonePortrait = false; 
        if (result.matches) {
          this.isPhonePortrait = true;
        }
    });

    this.images = this.post.images;
  }
}
