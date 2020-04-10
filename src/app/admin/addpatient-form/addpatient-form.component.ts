import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { LocationService } from '../../services/location.service';
import { DatabaseService } from '../../services/database.service';
import { RouteMapItem } from '../../interfaces/route-map-item';
// import { LatLong } from '../../interfaces/lat-long';
import { Patient } from '../../interfaces/patient';


@Component({
  selector: 'app-addpatient-form',
  templateUrl: './addpatient-form.component.html',
  styleUrls: ['./addpatient-form.component.css']
})
export class AddpatientFormComponent implements OnInit {
  patient: Patient = {
    pid: '',
    src_id: '',
    name: '',
    hospital: '',
    routeMap: []
  }
  displayedColumns: string[] = ['district', 'location', 'startTime', 'endTime', 'latitude', 'longitude'];
  dataSource = new MatTableDataSource();
  currentInput: RouteMapItem = {
    district: null,
    location: null,
    startTime: null,
    endTime: null,
    latitude: null,
    longitude: null,
  }

  constructor(
    // private locationService: LocationService,
    private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.dataSource.data = this.patient.routeMap;
  }

  saveCurrentInput() {
    console.log(this.currentInput);
    this.patient.routeMap.push({
      ...this.currentInput
    });
    this.dataSource.data = this.patient.routeMap;
    this.currentInput = {
      district: null,
      location: null,
      startTime: null,
      endTime: null,
      latitude: null,
      longitude: null
    }
    // // to get LatLong from location name
    // this.locationService.getLatLong(this.currentInput.location)
    //   .subscribe(responseJSON => {
    //     console.log(responseJSON);
    //     var latLong = responseJSON.results[0].locations[0].latLng;
    //     console.log(latLong);
    //     this.patient.routeMap.push({
    //       ...this.currentInput,
    //       latitude: latLong.lat, 
    //       longitude: latLong.lng
    //     });
    //     this.dataSource.data = this.patient.routeMap;
    //     this.currentInput = {
    //       location: null,
    //       startTime: null,
    //       endTime: null,
    //     }
    //   });
  }

  submit() {
    console.log("submitting");
    this.dbService.addPatient(this.patient);
  }

  clear() {
    this.dataSource.data = [];
    this.patient.routeMap = [];
  }
}
