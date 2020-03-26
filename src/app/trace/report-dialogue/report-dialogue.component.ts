import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-dialogue',
  templateUrl: './report-dialogue.component.html',
  styleUrls: ['./report-dialogue.component.scss']
})
export class ReportDialogueComponent implements OnInit {
  
  user:any = {name:'',phone:'',address:''};
  
  ngOnInit(){
  }

  constructor(
    public dialogRef: MatDialogRef<ReportDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


}
