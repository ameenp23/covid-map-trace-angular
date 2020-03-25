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

  trace() {
    let patientRef,lat2,lon2,ploc,p_tstamp,month,date,p_hr,p_min,pstart,p_shr,p_smin,pend,p_ehr,p_emin;

    this.locations.forEach((patientLocation)=>{
      patientRef = patientLocation.patientRef.path
      lat2 = patientLocation.geopoint.F;
      lon2 = patientLocation.geopoint.V;
      ploc = patientLocation.location;
      if(patientLocation.hasOwnProperty("DT")){
          p_tstamp = patientLocation.DT.seconds * Math.pow(10,3);
          let i = new Date(Number(p_tstamp));
          month = i.getMonth()+1;
          date = i.getDate();
          p_hr = i.getHours();
          p_min = i.getMinutes();
      }
      else {
          pstart = patientLocation.duration.startt.seconds * Math.pow(10,3);
          let i =new Date(Number(pstart));
          month = i.getMonth()+1;
          date = i.getDate();
          p_shr = i.getHours();
          p_smin = i.getMinutes();
          pend = patientLocation.duration.endt.seconds * Math.pow(10,3);
          i =new Date(Number(pend));
          p_ehr = i.getHours();
          p_emin = i.getMinutes();
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

          if (this.find(lat1,lon1,lat2,lon2)<2){
            if(p_tstamp){    
                if((startt < p_tstamp) && (p_tstamp < endt)){
                  let suspect:any = {};
                  suspect.date = month+"/"+date;
                  suspect.loc = uloc;
                  suspect.time = ushour+":"+usmin+" to "+uehour+":"+uemin;
                  suspect.ploc =  ploc;
                  suspect.ptime =  p_hr+":"+p_min;
                  this.suspected.push(suspect);
                }
            }
            else{
                if(pstart < endt && pend > startt){
                  let suspect:any = {};
                  suspect.date = month+"/"+date;
                  suspect.loc = uloc;
                  suspect.time = ushour+":"+usmin+" to "+uehour+":"+uemin;
                  suspect.ploc =  ploc;
                  suspect.ptime = p_shr+":"+p_smin+" to "+p_ehr+":"+p_emin;
                  this.suspected.push(suspect);
                }
            }
          }
        }
      });
    });
    this.dataSource.data=this.suspected;
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
    const dialogRef = this.dialog.open(ReportDialogueComponent, {
      width: '250px',
      data: {name: 'TEST'}
    });
  }

}
