import { Component, OnInit } from '@angular/core';
declare const showSlides: any;
declare const plusSlides: any;
declare const currentSlide: any;

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  public imagesUrl;
  constructor() { }

  ngOnInit(): void {
    showSlides(1);
  }
  
  

}
