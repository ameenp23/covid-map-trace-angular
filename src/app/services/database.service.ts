import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RouteMapItem } from '../interfaces/route-map-item';
import * as firebase from 'firebase/app';

import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private firestore: AngularFirestore) { }

  addPatient(patient: Patient) {
    console.log("from db service:");
    console.log(patient);
    var patientDetails = {
      pid: patient.pid,
      src_id: patient.src_id,
      name: patient.name,
      hospital: patient.hospital
    };
    return this.firestore.collection('patients').add(patientDetails)
      .then((ref) => {
        var routeMapItem: RouteMapItem;
        for(routeMapItem of patient.routeMap) {
          this.firestore.collection('patients').doc(ref.id).collection('routeMap').add({
            district: routeMapItem.district,
            location: routeMapItem.location,
            geopoint: new firebase.firestore.GeoPoint(routeMapItem.latitude, routeMapItem.longitude),
            locRef: '',
            patientRef: ref,
            duration: {
              startt: firebase.firestore.Timestamp.fromDate(new Date(routeMapItem.startTime)),
              endt: firebase.firestore.Timestamp.fromDate(new Date(routeMapItem.endTime))
            }
          })
          .then((ref2) => {
            console.log(`Added a routeMapItem with id=${ref2.id} to the patient id=${ref.id}`);
          })
        }
        console.log(`Added patient with id=${ref.id}`);
      });
  }
}
