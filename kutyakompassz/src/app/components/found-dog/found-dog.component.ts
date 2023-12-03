import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/db.service';

@Component({
  selector: 'app-found-dog',
  templateUrl: './found-dog.component.html',
  styleUrls: ['./found-dog.component.scss'],
})
export class FoundDogComponent implements OnInit {
  isPhonePortrait = false;
  posts: Post[] = [];
  type = 'found';

  constructor(
    private responsive: BreakpointObserver,
    private dbService: DatabaseService
  ) {}

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
