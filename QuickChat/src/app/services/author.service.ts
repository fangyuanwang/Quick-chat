import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from "angularfire2/database";
import { Author } from "app/models/author";

@Injectable()
export class AuthorService {
  readonly authorsPath = "authors";

  public authorMapStream: FirebaseObjectObservable<Map<string, Author>>;

  constructor(private db: AngularFireDatabase) {
    this.authorMapStream = this.db.object(this.authorsPath);
  }

  updateAuthor(authorKey: string, displayName: string, photoUrl: string): void {
    const author = new Author({
      displayName: displayName,
      photoUrl: photoUrl,
    });

    this.db.object(`/${this.authorsPath}/${authorKey}`).set(author);
  }

}
