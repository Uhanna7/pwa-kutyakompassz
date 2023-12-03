import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-search-dog',
  templateUrl: './search-dog.component.html',
  styleUrls: ['./search-dog.component.scss']
})
export class SearchDogComponent {
  type = 'search';
  posts: Post[] = [];
  isPhonePortrait = false;

  constructor(private responsive: BreakpointObserver, private dbService: DatabaseService) {}

  ngOnInit() {
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
      this.isPhonePortrait = false;

      if (result.matches) {
        this.isPhonePortrait = true;
      }
    });

    this.loadPosts();
  }

  loadPosts() {
    this.dbService.getPosts().subscribe((data) => {
      this.posts = data;
      console.log(this.posts);
    });
  }

}
