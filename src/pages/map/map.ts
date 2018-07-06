import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  locationDetail :string = "กำลังค้นหา";

  location = {
    lat: 18.771739,
    lng: 98.8864364
  }

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,    
    private geolocation: Geolocation,
    private toasCtrl:ToastController,
    private loadCtrl:LoadingController
  ) {
    this.onLocation();
  }

  onLocation() {

    const loader = this.loadCtrl.create({
      content: 'กรุณาเปิด GPS'
    });
    loader.present();

    this.geolocation.getCurrentPosition()
      .then((resp) => {
        loader.dismiss();
        this.location.lat = resp.coords.latitude
        this.location.lng = resp.coords.longitude

        console.log(this.location);
        var google_map_pos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        var google_maps_geocoder = new google.maps.Geocoder();
        google_maps_geocoder.geocode(
          { 'latLng': google_map_pos },
           (results, status) => {
            if (status == google.maps.GeocoderStatus.OK && results[0]) {
                this.locationDetail = results[0].formatted_address;
              console.log(this.locationDetail);
            }
          }
        );
        
      })
      .catch((error) => {

        console.log('Error getting location', error);

        loader.dismiss();
        const toast = this.toasCtrl.create({
          message: 'Could not get location, please pick it manually!',
          duration: 2500
        })
        toast.present();
      });
  }

}
