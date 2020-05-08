import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { RouteMapItem } from '../interfaces/route-map-item';
import * as firebase from 'firebase/app';
import { tap } from 'rxjs/operators';


import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private locations = [];
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
        console.log(`Added patient with id=${ref.id}`)
        for(let routeMapItem of patient.routeMap as any) {
          let newPatient:any = {
            district: routeMapItem.district,
            location: routeMapItem.location,
            geopoint: new firebase.firestore.GeoPoint(routeMapItem.latitude, routeMapItem.longitude),
            locRef: '',
            patientRef: ref,
            duration: {
              startt: firebase.firestore.Timestamp.fromDate(new Date(routeMapItem.startTime)),
              endt: firebase.firestore.Timestamp.fromDate(new Date(routeMapItem.endTime))
            }
          };
          if(routeMapItem.DT) newPatient.DT=firebase.firestore.Timestamp.fromDate(new Date(routeMapItem.startTime));
          this.firestore.collection('patients').doc(ref.id).collection('routeMap').add(newPatient)
          .then((ref2) => {
            console.log(`Added a routeMapItem with id=${ref2.id} to the patient id=${ref.id}`);
            let db = firebase.firestore();
            let locRef = db.collection('locations');
            locRef.where('address', '==', routeMapItem.location).get().then(snapshot => {
              if (snapshot.empty) {

                this.firestore.collection('locations').add({
                  district: routeMapItem.district,
                  address: routeMapItem.location,
                  geopoint: new firebase.firestore.GeoPoint(routeMapItem.latitude, routeMapItem.longitude)
                }).then((ref3) => {
                  console.log(`Added a new location with id=${ref3.id}`);
                  let patientRef:any = {
                    ref: ref,
                    duration: newPatient.duration
                  };
                  if(newPatient.DT) patientRef.DT=newPatient.DT
                  this.firestore.collection('locations').doc(ref3.id).collection('patients').add(patientRef).then(() => {
                    console.log("Added patientRef to the new location")
                  })
                  ref2.update({
                    locRef: ref3
                  }).then(() => {
                    console.log("Updated locRef in patient document with new locationRef")
                  })
                })

              } else {

                snapshot.forEach(doc => {
                  console.log(`location already exists with id=${doc.id}`)
                  ref2.update({
                    locRef: doc.ref.path
                  }).then(() => {
                    console.log("updated locRef in patient with existing location")
                  })
                  db.collection('locations').doc(doc.id).collection('patients').add({ref}).then(() => {
                    console.log("Added patientRef to the existing location")
                  })
                })
                
              }
            })
          })
        }
      });
  }

  fetchLocations() {
    if (this.locations && this.locations.length) {
      return of(this.locations)
    } else {
      return this.firestore.collection('locations', ref => {
        return ref.orderBy('address')
      }).valueChanges().pipe(
        tap((locs) => this.locations = locs)
      );
    }
  }
}
