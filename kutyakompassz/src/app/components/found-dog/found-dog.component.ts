import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-found-dog',
  templateUrl: './found-dog.component.html',
  styleUrls: ['./found-dog.component.scss'],
})
export class FoundDogComponent implements OnInit {
  posts: any[] = [];
  isPhonePortrait = false;

  constructor(
    private responsive: BreakpointObserver,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
      this.isPhonePortrait = false;

      if (result.matches) {
        this.isPhonePortrait = true;
      }
    });

    this.getPosts();
  }

  getPosts() {
    this.postService.getPosts().subscribe((data: any) => {
      this.posts = data;
    });
  }
}
