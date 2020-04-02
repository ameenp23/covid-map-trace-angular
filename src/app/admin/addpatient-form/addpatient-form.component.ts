import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LocationService } from '../../services/location.service';
import { DatabaseService } from '../../services/database.service';
import { RouteMapItem } from '../../interfaces/route-map-item';
import { LatLong } from '../../interfaces/lat-long';

@Component({
  selector: 'app-addpatient-form',
  templateUrl: './addpatient-form.component.html',
  styleUrls: ['./addpatient-form.component.css']
})
export class AddpatientFormComponent implements OnInit {
  name: string = '';
  address: string = '';
  routeMap: RouteMapItem[] = [];
  displayedColumns: string[] = ['location', 'startTime', 'endTime'];
  dataSource = new MatTableDataSource();
  currentInput = {
    location: null,
    startTime: null,
    endTime: null
  }
  xmlHttp = new XMLHttpRequest();

  constructor(
    private locationService: LocationService,
    private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.dataSource.data = this.routeMap;
  }

  saveCurrentInput() {
    console.log(this.currentInput);
    this.locationService.getLatLong(this.currentInput.location)
      .subscribe(responseJSON => {
        console.log(responseJSON);
        var latLong = responseJSON.results[0].locations[0].latLng;
        console.log(latLong);
        this.routeMap.push({
          ...this.currentInput,
          latitude: latLong.lat, 
          longitude: latLong.lng
        });
        this.dataSource.data = this.routeMap;
        this.currentInput = {
          location: null,
          startTime: null,
          endTime: null,
        }
      });
  }

  submit() {
    console.log("submitting");
    console.log({
      name: this.name,
      address: this.address,
      routeMap: this.routeMap
    });
    this.dbService.addPatient({
      name: this.name,
      address: this.address,
      routeMap: this.routeMap
    });
  }

  clear() {
    this.dataSource.data = [];
    this.routeMap = [];
  }

  getLatLong(address: string): any {  
    
  }
}
