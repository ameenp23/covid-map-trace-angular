import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface LatLong {
  latitude: number,
  longitude: number
}

const geocodingUrl = "http://www.mapquestapi.com/geocoding/v1/address?key=zTJGcEgpfxjWCeNQHtYpkQ0Lr2tkIDCA&location=";

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLatLong(place: string): Observable<any> {
    return this.http.get<any>(geocodingUrl+place);
  }
}
