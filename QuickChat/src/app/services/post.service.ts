import { Injectable } from '@angular/core';
import { Post, PostWithAuthor } from "app/models/post";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/scan';
import { AuthorService } from "app/services/author.service";
import { Author } from "app/models/author";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import * as firebase from 'firebase/app';

@Injectable()
export class PostService {
  readonly postsPath = "posts";
  readonly postBatchSize = 20;

  postWithAuthorStream: Observable<PostWithAuthor[]>;
  private postIncrementStream: Subject<number>;

  public hideLoadMoreBtn = false;

  constructor(private db: AngularFireDatabase, private authorService: AuthorService) {
    this.postIncrementStream = new BehaviorSubject<number>(this.postBatchSize);
    const numPostStream: Observable<number> = this.postIncrementStream
      .scan<number>( (previousTotal: number, currenValue: number) => { 
        return previousTotal + currenValue;
     });

    const postStream: Observable<Post[]> = numPostStream
      .switchMap<number, Post[]>( (numPosts: number) => { 
        return this.db.list(this.postsPath, {
                query: {
                  limitToLast: numPosts,
                }
              });
     });

    this.postWithAuthorStream = Observable.combineLatest<PostWithAuthor[]>( 
      postStream,
      this.authorService.authorMapStream,
      numPostStream,
      (posts: Post[], authorMap: Map<string, Author>, numPostsRequested: number) => { 
        const postsWithAuthor: PostWithAuthor[] = [];
        this.hideLoadMoreBtn = numPostsRequested > posts.length;
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
    firebase.database().ref().child(this.postsPath).push(post);
  }

  displayMorePosts(): void {
    this.postIncrementStream.next(this.postBatchSize);
  }

  remove(keyToRemove: string): void {
    firebase.database().ref().child(this.postsPath).child(keyToRemove).remove();
    
    //alternative way
    // this.db.object(`/${this.postsPath}/${keyToRemove}`).remove();
  }

  update(key: string, post: Post): void {
    firebase.database().ref().child(this.postsPath).child(key).set(post);
  }
}
