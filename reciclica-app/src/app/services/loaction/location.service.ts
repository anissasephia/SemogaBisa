import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var google: any;
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }
  geocode(position: {latitude: number, longitude: number}): Observable<any> {
    return new Observable<any>(observer => {
      const goecoder = new google.maps.Geocoder();
      const latLng = new google.maps.LatLng(position.latitude, position.longitude);
      goecoder.geocode({latLng}, (results: any, status: any) => {
        if (status == google.maps.GeocoderStatus.OK){
          observer.next(results[0])
        } else {
          observer.error(status);
        }
        observer.complete();
      })
    }) 
  }
}