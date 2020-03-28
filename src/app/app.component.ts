import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-map-trace-angular';
  menu: HTMLInputElement;
  openMenu(){
    this.menu=document.getElementById('menu-btn') as HTMLInputElement;
    document.getElementById('list').style.maxHeight= this.menu.checked?'0':'300px';
  }

  closeMenu(){
    document.getElementById('list').style.maxHeight='0';
    this.menu.checked=false;
  }
}
