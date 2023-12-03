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
    title: '',
    description: '',
    date: '',
    location: '',
    type: '',
  };
  
  images: string[] = [
    '../assets/blog1.png',
    '../assets/blog2.png',
    '../assets/blog3.png',
    '../assets/blog4.png',
    '../assets/blog.png',
  ];

  isPhonePortrait = false;
  
  constructor(private responsive: BreakpointObserver) {}

  ngOnInit() {
    this.responsive.observe(Breakpoints.HandsetPortrait)
      .subscribe(result => {

        this.isPhonePortrait = false; 

        if (result.matches) {
          this.isPhonePortrait = true;
        }

    });

  }

}
