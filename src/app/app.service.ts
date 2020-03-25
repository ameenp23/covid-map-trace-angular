import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private firestore: AngularFirestore) { }

  getLocations() {
    return this.firestore.collectionGroup('locations').valueChanges();
  }
}
