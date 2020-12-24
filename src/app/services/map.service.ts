import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item, Patient } from '../interfaces/Item';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  patients: Observable<Patient[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  constructor(public afs: AngularFirestore) {
    // this.items = this.afs.collection('locations').valueChanges();
    this.itemsCollection = this.afs.collection('items', (ref) =>
      ref.orderBy('district', 'asc')
    );

    this.items = this.afs
      .collection('locations')
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((a) => {
            const data = a.payload.doc.data() as Item;
            data.id = a.payload.doc.id;
            return data;
          });
        })
      );

    // this.afs
    // .collection('locations')
    // .doc(idField)
    // .collection('patients')
    // .valueChanges();
    // this.itemsCollection = this.afs.collection('items', (ref) =>
    //   ref.orderBy('title', 'asc')
    // );

    // this.items = this.itemsCollection.snapshotChanges().map((changes) => {
    //   return changes.map((a) => {
    //     const data = a.payload.doc.data() as Item;
    //     data.id = a.payload.doc.id;
    //     return data;
    //   });
    // });
  }

  getItems() {
    return this.items;
  }

  getPatients(id: string) {
    this.itemDoc = this.afs.doc(`locations/${id}`);
    this.patients = this.itemDoc.collection('patients').valueChanges();

    console.log(this.patients);
    return this.patients;
  }
}
