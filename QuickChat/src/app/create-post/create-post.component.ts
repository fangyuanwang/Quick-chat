import { Component, OnInit } from '@angular/core';
import { AuthService } from "app/services/auth.service";
import { Post } from "app/models/post";
import { PostService } from "app/services/post.service";

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['../shared/common.scss','./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postBodyText: string;

  constructor(public authService: AuthService, 
    private postService: PostService) { }

  ngOnInit() {
  }

  onSubmit(): void {
    try {
      const post = new Post({
        authorKey: this.authService._currentUserUid,
        body: this.postBodyText
      });
      // console.log("submit", post);
      this.postService.add(post);
      this.postBodyText = '';
    } catch (error) {
      console.log("submit fails", error);
    }
  }
}
