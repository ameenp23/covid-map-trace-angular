import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface UserLocationData {
  place: string;
  startTime: any;
  endTime: any;
}

@Component({
  selector: 'app-addpatient-form',
  templateUrl: './addpatient-form.component.html',
  styleUrls: ['./addpatient-form.component.css']
})
export class AddpatientFormComponent implements OnInit {
  locations: UserLocationData[] = [];
  displayedColumns: string[] = ['place', 'startTime', 'endTime'];
  dataSource = new MatTableDataSource();
  currentInput = {
    place: null,
    startTime: null,
    endTime: null
  };

  ItemsArray= [];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.locations;
  }

  saveCurrentInput() {
    console.log(this.currentInput);
    this.locations.push(this.currentInput);
    this.ItemsArray.push(this.currentInput);
    this.dataSource.data = this.locations;
    this.currentInput = {
      place: null,
      startTime: null,
      endTime: null
    }
  }

  submit() {
    window.alert("This feature is not implemented yet");
  }

  clear() {
    this.dataSource.data = [];
    this.locations = [];
  }
}
