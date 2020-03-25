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

  locations: {}[];
  file:any;
  fileChanged(e) {
      this.file = e.target.files[0];
  }

  constructor(public dialog: MatDialog, private appService: AppService) {}  

  ngOnInit(): void {
    this.appService.getLocations().subscribe(locations => {
      this.locations=locations;
    })
  }
  
  ELEMENT_DATA = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},

  ];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'select'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  selection = new SelectionModel(true, []);

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
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
    }
    fileReader.readAsText(this.file);
  }

  report(): void {
    const dialogRef = this.dialog.open(ReportDialogueComponent, {
      width: '250px',
      data: {name: 'TEST'}
    });
  }

}
