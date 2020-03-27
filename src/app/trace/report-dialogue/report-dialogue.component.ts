import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private appService: AppService) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getErrors() {
    return this.user.name==''||this.user.phone==''? '*Name and Phone Number is required' :
      this.user.phone.length!=10? '*Enter a valid Phone number' : '';
  }

  report() {
    this.user.sources = this.data.sources;
    this.dialogRef.close();
    this.appService.addFlag(this.user)
    .then(msg => {
      this.openSnackBar('Reported successfully!','Close');
    })
    .catch(msg => {
      this.openSnackBar('Failed! Try again later','Close');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }  

}
