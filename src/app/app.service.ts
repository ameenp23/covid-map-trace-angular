import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'

export interface Location {}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private firestore: AngularFirestore) { }

  getLocations() {
    return this.firestore.collectionGroup('locations').snapshotChanges().pipe(
      map(locations => locations.map(location => {
        const id = location.payload.doc.id;
        const data = location.payload.doc.data() as Location;
        return {id,...data};
      }))
    )
  }
}
