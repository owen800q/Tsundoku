import * as firebase from '../functions/node_modules/firebase';

export interface ResolvedBook {
  desc: string;
  donor: string;
  image: string;
  isbn: string;
  title: string;
  pageCount: number;
}

export interface RegisteredBook extends ResolvedBook {
  created: firebase.firestore.Timestamp;
  modified: firebase.firestore.Timestamp;
}

export interface Plan {
  title: string;
  desc: string;
  isbn: string;
  progress: number;
  uid: string;
  created: firebase.firestore.Timestamp;
  modified: firebase.firestore.Timestamp;
}

export interface Skill {
  content: string;
  created: firebase.firestore.Timestamp;
  uid: string;
}
