import { MapPage } from './../map/map';
import { HomePage } from './../home/home';
import { Component  } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { Geolocation } from '@ionic-native/geolocation';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  locationDetail :any ;

  constructor( 
    private navCtrl: NavController,
    public callNumber: CallNumber,
    private alertCtrl :AlertController,
    private geolocation: Geolocation

  ){
    this.onLocation(); 

  }

  openMap(){
    this.navCtrl.push(MapPage);
  }

  goToHomepage(){
    this.navCtrl.push(HomePage);
  }

  onCall(){

    let confirm = this.alertCtrl.create({
      title: 'โทรแจ้ง 1669',
      message: `ทันที`,
      buttons: [
        {
          text: 'ยกเลิก',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'โทร',
          handler: () => {
            console.log('Agree clicked');
            this.callNumber.callNumber("1669", true)
          }
        }
      ]
    });
    confirm.present();
  }

  onLocation() {


    this.geolocation.getCurrentPosition()
      .then((resp) => {

        var lat = resp.coords.latitude
        var lng = resp.coords.longitude

        var google_map_pos = new google.maps.LatLng(lat, lng);
        var google_maps_geocoder = new google.maps.Geocoder();
        google_maps_geocoder.geocode(
          { 'latLng': google_map_pos },
           (results, status) => {
            if (status == google.maps.GeocoderStatus.OK && results[0]) {
                this.locationDetail = results[0].formatted_address;
                console.log(this.locationDetail)
            }
          }
        );
        
      })
      .catch((error) => {
      });
  }
}



