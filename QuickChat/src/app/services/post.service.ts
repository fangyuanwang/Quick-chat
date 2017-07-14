import { Injectable } from '@angular/core';
import { Post, PostWithAuthor } from "app/models/post";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest';
import { AuthorService } from "app/services/author.service";
import { Author } from "app/models/author";

@Injectable()
export class PostService {
  readonly postsPath = "posts";
  private _postStream: FirebaseListObservable<Post[]>;

  postWithAuthorStream: Observable<PostWithAuthor[]>;

  constructor(private db: AngularFireDatabase, private authorService: AuthorService) {
    this._postStream = this.db.list(this.postsPath);
    this.postWithAuthorStream = Observable.combineLatest<PostWithAuthor[]>( 
      this._postStream,
      this.authorService.authorMapStream,
      (posts: Post[], authorMap: Map<string, Author>) => { 
        const postsWithAuthor: PostWithAuthor[] = [];
        for (let post of posts) {
          const postWithAuthor = new PostWithAuthor(post);
          postWithAuthor.author = authorMap[post.authorKey];
          postsWithAuthor.push(postWithAuthor);
        }
        return postsWithAuthor;
      });
   }

  add(post: Post) {
    console.log("Push post", post);
    this._postStream.push(post);
  }
  
  // get postStream(): FirebaseListObservable<Post[]> {
  //   return this._postStream;
  // }

}
