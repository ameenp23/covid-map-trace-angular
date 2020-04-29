import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  public imagesUrl;
  slideIndex=1;

  constructor() { }

  ngOnInit(): void {
    this.showSlides(1);
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }
  
  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }
  
  showSlides(n) {
    var i;
    var slides = Array.from(document.getElementsByClassName("mySlides")as HTMLCollectionOf<HTMLElement>);
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) {this.slideIndex = 1}    
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    if(slides[this.slideIndex-1])slides[this.slideIndex-1].style.display = "block";  
    if(dots[this.slideIndex-1])dots[this.slideIndex-1].className += " active";
  }
  

}
