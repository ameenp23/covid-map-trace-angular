import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ReportDialogueComponent } from './report-dialogue/report-dialogue.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-trace',
  templateUrl: './trace.component.html',
  styleUrls: ['./trace.component.scss']
})
export class TraceComponent implements OnInit {

  userLocationHistory: any = null;
  locations: any;
  suspected=[];
  displayMessage = false;

  constructor(public dialog: MatDialog, private appService: AppService) {}  

  ngOnInit(): void {
    this.appService.getLocations().subscribe((locations:any) => {
      this.locations=locations;
    })
  }

  displayedColumns: string[] = ['date', 'loc', 'time', 'ploc', 'ptime', 'select'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);

  upload(e) {
    let file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = () => {
      this.userLocationHistory=JSON.parse(fileReader.result as string).timelineObjects;
    }
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
    if(this.displayMessage){
      return this.dataSource.data.length>0? "You were in contact with the following patients. Report and seek medical help immediately!" 
      : "You were NOT in contact with any patients. Stay Home! Stay Safe!"
    }
  }

  trace() {
    let patientDetails:any ={};
    this.locations.forEach((patientLocation)=>{
      patientDetails={};
      patientDetails.locationId = patientLocation.id;
      patientDetails.patientRef = patientLocation.patientRef.path
      patientDetails.lat2 = patientLocation.geopoint.F;
      patientDetails.lon2 = patientLocation.geopoint.V;
      patientDetails.ploc = patientLocation.location;
      if(patientLocation.hasOwnProperty("DT")){
        patientDetails.p_tstamp = patientLocation.DT.seconds * Math.pow(10,3);
        patientDetails.pstart = patientDetails.p_tstamp-1800000;
        patientDetails.pend = patientDetails.p_tstamp+1800000;
          let i = new Date(Number(patientDetails.p_tstamp));
          patientDetails.month = i.getMonth()+1;
          patientDetails.date = i.getDate();
          patientDetails.p_hr = i.getHours();
          patientDetails.p_min = this.getminutes(i);
      }
      else {
        patientDetails.pstart = patientLocation.duration.startt.seconds * Math.pow(10,3);
          let i =new Date(Number(patientDetails.pstart));
          patientDetails.month = i.getMonth()+1;
          patientDetails.date = i.getDate();
          patientDetails.p_shr = i.getHours();
          patientDetails.p_smin = this.getminutes(i);
          patientDetails.pend = patientLocation.duration.endt.seconds * Math.pow(10,3);
          let j =new Date(Number(patientDetails.pend));
          patientDetails.p_ehr = j.getHours();
          patientDetails.p_emin = this.getminutes(j);
      }
      this.userLocationHistory.forEach((userLocation)=>{
        if(userLocation.hasOwnProperty("placeVisit")) {
          let lat1 = userLocation.placeVisit.location.latitudeE7/Math.pow(10,7);
          let lon1 = userLocation.placeVisit.location.longitudeE7/Math.pow(10,7);
          let startt = userLocation.placeVisit.duration.startTimestampMs;
          let endt = userLocation.placeVisit.duration.endTimestampMs;
          let uloc = userLocation.placeVisit.location.address;
          let d1 = new Date(Number(startt));
          let ushour = d1.getHours();
          let usmin = d1.getMinutes();
          let d2 = new Date(Number(endt));
          let uehour = d2.getHours();
          let uemin = d2.getMinutes();

          if (this.find(lat1,lon1,patientDetails.lat2,patientDetails.lon2)<5 && patientDetails.pstart < endt && patientDetails.pend > startt){    
                  let suspect:any = {};
                  suspect.date = patientDetails.month+"/"+patientDetails.date;
                  suspect.loc = uloc;
                  suspect.time = ushour+":"+usmin+" to "+uehour+":"+uemin;
                  suspect.ploc =  patientDetails.ploc;
                  suspect.ptime = patientDetails.p_tstamp? patientDetails.p_hr+":"+patientDetails.p_min : 
                                  patientDetails.p_shr+":"+patientDetails.p_smin+" to "+patientDetails.p_ehr+":"+patientDetails.p_emin;
                  suspect.patientId = patientDetails.patientRef;
                  suspect.locationId = patientDetails.locationId;
                  this.suspected.push(suspect);
          }
        }
      });
    });
    this.dataSource.data=this.suspected;
    this.displayMessage=true;
  }

  getminutes(timestamp:Date) {
    return timestamp.getMinutes()<10? '0'+timestamp.getMinutes() : timestamp.getMinutes();
  }

  find(lat1_deg, lon1_deg, lat2_deg, long2_deg){
    const deg2rad = Math.PI / 180;
    const EARTH_RADIUS_KM = 6371.01;
    let lat1 = lat1_deg*deg2rad;
    let long1 = lon1_deg*deg2rad;
    let lat2 = lat2_deg*deg2rad;
    let long2 = long2_deg*deg2rad;

    return Math.acos(
        (Math.sin(lat1)*Math.sin(lat2))+
        (Math.cos(lat1)*Math.cos(lat2)*Math.cos(long1-long2))
    )*EARTH_RADIUS_KM;
  };

  report(): void {
    let sources = this.selection.selected.map(x=>({
      locationRef: '/locations/'+x.locationId,
      suspectRef: '/'+x.patientId}));
    const dialogRef = this.dialog.open(ReportDialogueComponent, {
      width: '250px',
      data: {sources: sources}
    });
  }

}
