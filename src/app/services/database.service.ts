import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouteMapItem } from '../interfaces/route-map-item';

import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  addPatient(patient: Patient) {
    var patientDetails = {
      name: patient.name,
      address: patient.address
    };
    return this.firestore.collection('patients').add(patientDetails)
      .then((ref) => {
        var routeMapItem: RouteMapItem;
        for(routeMapItem of patient.routeMap) {
          this.firestore.collection('patients').doc(ref.id).collection('routeMap').add(routeMapItem)
          .then((ref2) => {
            console.log(`Added a routeMapItem with id=${ref2.id} to the patient id=${ref.id}`);
          })
        }
        console.log(`Added patient with id=${ref.id}`);
      });
  }
}
