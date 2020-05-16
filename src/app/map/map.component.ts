import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import * as geolib from 'geolib';
import { MapService } from '../services/map.service';
import { Item, Patient } from '../interfaces/Item';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map;
  items: Item[];
  flag: boolean;

  patients: Patient[];

  constructor(private mapService: MapService) {}
  ngOnInit() {
    this.flag = false;

    console.log('Ng On init Ran');
    this.mapService.getItems().subscribe((items) => {
      console.log('items');
      console.log(items);
      this.items = items;

      this.flag = true;
      var itemList = this.items;

      // Call Draw Map Here
      this.initMap();

      // Get Patients here and set the intensity based on that
      //
      // console.log('itemsList');
      // for (var i = 0; i < itemList.length; i++) {
      //   this.mapService.getPatients(itemList[i].id).subscribe((items) => {
      //     console.log(items);
      //   });
      // }
    });
  }

  ngAfterViewInit(): void {}

  private initMap(): void {
    var geoPointValues = [];

    this.items.forEach((element) => {
      geoPointValues.push([
        element.geopoint.latitude,
        element.geopoint.longitude,
        1,
      ]);
    });

    // using geolib library we can convert
    // sexagecimal inputs to decimal values. So
    // if the data is int sexagecimal, we just need
    // to run the data convert it using the below
    // sexagesimalToDecimal function
    var x1 = geolib.sexagesimalToDecimal(`9° 58' 37" N`);
    var y1 = geolib.sexagesimalToDecimal(`76° 16' 38" E`);

    // this part creates the map using Leaflet
    // we can specifyt the default place the map centers in to
    // and the zoom level the map starts from.
    this.map = L.map('map', {
      center: [x1, y1], // Set Map Centered in Initialize Here
      zoom: 19, // Set default Zoom in HERE
    });

    // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http:q//www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    // for reference : https://github.com/Leaflet/Leaflet.heat
    L.heatLayer(geoPointValues, {
      radius: 50,
      minOpacity: 0.25,
      blur: 35,
      // gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' },
    }).addTo(this.map);
  }
}
