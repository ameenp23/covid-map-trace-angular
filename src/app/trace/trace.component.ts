import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import { ReportDialogueComponent } from './report-dialogue/report-dialogue.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-trace',
  templateUrl: './trace.component.html',
  styleUrls: ['./trace.component.scss']
})
export class TraceComponent implements OnInit {

  userLocationHistory: any = null;
  locations: Array<any>;
  suspected = [];
  displayMessage = false;
  details = 'uploaded';
  user: any = { place: '', startTime: '', endTime: '' };
  mapUrl = 'http://www.mapquestapi.com/geocoding/v1/address?key=zTJGcEgpfxjWCeNQHtYpkQ0Lr2tkIDCA&location=';

  constructor(public dialog: MatDialog, private appService: AppService, private http: HttpClient,private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.appService.getLocations().subscribe((locations: any) => {
      this.locations = locations;
      this.locations.map(x => this.formatPatientLocationData(x));
    })
  }

  displayedColumns: string[] = ['date', 'loc', 'time', 'ploc', 'ptime', 'select'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  formatPatientLocationData(patientLocation: any) {
    patientLocation.patientRef = patientLocation.patientRef.path
    patientLocation.lat2 = patientLocation.geopoint.F;
    patientLocation.lon2 = patientLocation.geopoint.V;
    patientLocation.ploc = patientLocation.location;
    if (patientLocation.hasOwnProperty("DT")) {
      patientLocation.p_tstamp = patientLocation.DT.seconds * Math.pow(10, 3);
      patientLocation.pstart = patientLocation.p_tstamp - 1800000;
      patientLocation.pend = patientLocation.p_tstamp + 1800000;
      let i = new Date(Number(patientLocation.p_tstamp));
      patientLocation.month = i.getMonth() + 1;
      patientLocation.date = i.getDate();
      patientLocation.p_hr = i.getHours();
      patientLocation.p_min = this.getminutes(i);
    }
    else {
      patientLocation.pstart = patientLocation.duration.startt.seconds * Math.pow(10, 3);
      let i = new Date(Number(patientLocation.pstart));
      patientLocation.month = i.getMonth() + 1;
      patientLocation.date = i.getDate();
      patientLocation.p_shr = i.getHours();
      patientLocation.p_smin = this.getminutes(i);
      patientLocation.pend = patientLocation.duration.endt.seconds * Math.pow(10, 3);
      let j = new Date(Number(patientLocation.pend));
      patientLocation.p_ehr = j.getHours();
      patientLocation.p_emin = this.getminutes(j);
    }
  }

  upload(e) {
    let file = e.target.files[0];
    const fileReader = new FileReader();
    if(file){
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = () => {
        this.userLocationHistory = JSON.parse(fileReader.result as string).timelineObjects;
      }
    }
  }

  swap(x) {
    this.details = x==1? 'uploaded':'entered';
    if(x==2) this.userLocationHistory=null;
  }

  getErrors() {
    return (this.user.place == '' || this.user.startTime == '') && this.details == 'entered' ? true :
     !this.userLocationHistory && this.details=='uploaded' ? true : false;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: { position: number; }): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  showMessage() {
    if (this.displayMessage) {
      return this.dataSource.data.length > 0 ? "You were in contact with the following patients. Report and seek medical help immediately!"
        : "You were NOT in contact with any patients. Stay Home! Stay Safe!"
    }
  }

  trace() {
    this.spinner.show();
    this.suspected=[];
    this.dataSource.data=[];
    this.displayMessage=false;
    return this.details == 'uploaded' ? this.traceJSON() : this.traceDetails();
  }

  traceDetails() {
    this.user.startT = new Date(this.user.startTime).getTime();
    this.user.endT = this.user.endTime != '' ? new Date(this.user.endTime).getTime() : this.user.startT + 1800000;
    this.user.startT = this.user.endTime != '' ? this.user.startT : this.user.startT - 1800000;
    this.http.get(this.mapUrl + this.user.place).subscribe((location: any) => {
      let latLon = location.results[0].locations[0].latLng;
      this.user.lat1 = latLon.lat;
      this.user.lon1 = latLon.lng;
      this.locations.forEach((patientDetails) => {
        if (this.find(this.user.lat1, this.user.lon1, patientDetails.lat2, patientDetails.lon2) < 10) {
          let suspect: any = {};
          suspect.date = patientDetails.month + "/" + patientDetails.date;
          suspect.loc = this.user.place;
          let t = new Date(this.user.startTime);
          suspect.time = t.getHours()+':'+this.getminutes(t);
          suspect.ploc = patientDetails.ploc;
          suspect.ptime = patientDetails.p_tstamp ? patientDetails.p_hr + ":" + patientDetails.p_min :
            patientDetails.p_shr + ":" + patientDetails.p_smin + " to " + patientDetails.p_ehr + ":" + patientDetails.p_emin;
          suspect.patientId = patientDetails.patientRef;
          suspect.locationId = patientDetails.id;
          this.suspected.push(suspect);
        }
      });
      this.dataSource.data = this.suspected;
      this.displayMessage = true;
      this.spinner.hide();
    });
  }

  traceJSON() {
    this.locations.forEach((patientDetails) => {
      this.userLocationHistory.forEach((userLocation) => {
        if (userLocation.hasOwnProperty("placeVisit")) {
          let lat1 = userLocation.placeVisit.location.latitudeE7 / Math.pow(10, 7);
          let lon1 = userLocation.placeVisit.location.longitudeE7 / Math.pow(10, 7);
          let startt = userLocation.placeVisit.duration.startTimestampMs;
          let endt = userLocation.placeVisit.duration.endTimestampMs;
          let uloc = userLocation.placeVisit.location.address;
          let d1 = new Date(Number(startt));
          let ushour = d1.getHours();
          let usmin = this.getminutes(d1);
          let d2 = new Date(Number(endt));
          let uehour = d2.getHours();
          let uemin = this.getminutes(d2);

          if (this.find(lat1, lon1, patientDetails.lat2, patientDetails.lon2) < 5 && patientDetails.pstart < endt && patientDetails.pend > startt) {
            let suspect: any = {};
            suspect.date = patientDetails.month + "/" + patientDetails.date;
            suspect.loc = uloc;
            suspect.time = ushour + ":" + usmin + " to " + uehour + ":" + uemin;
            suspect.ploc = patientDetails.ploc;
            suspect.ptime = patientDetails.p_tstamp ? patientDetails.p_hr + ":" + patientDetails.p_min :
              patientDetails.p_shr + ":" + patientDetails.p_smin + " to " + patientDetails.p_ehr + ":" + patientDetails.p_emin;
            suspect.patientId = patientDetails.patientRef;
            suspect.locationId = patientDetails.id;
            this.suspected.push(suspect);
          }
        }
      });
      this.spinner.hide();
      this.dataSource.data = this.suspected;
      this.displayMessage = true;
    });
  }

  getminutes(timestamp: Date) {
    return timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes();
  }

  find(lat1_deg, lon1_deg, lat2_deg, long2_deg) {
    const deg2rad = Math.PI / 180;
    const EARTH_RADIUS_KM = 6371.01;
    let lat1 = lat1_deg * deg2rad;
    let long1 = lon1_deg * deg2rad;
    let lat2 = lat2_deg * deg2rad;
    let long2 = long2_deg * deg2rad;

    return Math.acos(
      (Math.sin(lat1) * Math.sin(lat2)) +
      (Math.cos(lat1) * Math.cos(lat2) * Math.cos(long1 - long2))
    ) * EARTH_RADIUS_KM;
  };

  report(): void {
    let sources = this.selection.selected.map(x => ({
      locationRef: '/locations/' + x.locationId,
      suspectRef: '/' + x.patientId
    }));
    const dialogRef = this.dialog.open(ReportDialogueComponent, {
      width: '250px',
      data: { sources: sources }
    });
  }

}
