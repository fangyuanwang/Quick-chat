import { Component, OnInit, Input } from '@angular/core';
import { Post, PostWithAuthor } from "app/models/post";
import { AuthService } from "app/services/auth.service";
import { PostService } from "app/services/post.service";

export enum EditMode {
  notEditable = 0,
  displayEditButtons = 1,
  editing = 2,
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['../shared/common.scss', './post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() postWithAuthor: PostWithAuthor;

  public editingMode = EditMode.notEditable;
  
  constructor(private authService: AuthService, private postService: PostService) { 

  }

  ngOnInit() {
    if (this.postWithAuthor.authorKey == this.authService.currentUserUid) {
      this.editingMode = EditMode.displayEditButtons;
    }
  }

  remove() {
    console.log("remove");
    this.postService.remove(this.postWithAuthor.$key);
  }

  enableEditing() {
    console.log("edit");
  }
 
}
