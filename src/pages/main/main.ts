import { MapPage } from './../map/map';
import { HomePage } from './../home/home';
import { Component  } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from './../../models/location';
import * as firebase from 'firebase';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  datas: Datastructure = new Datastructure();

  locationDetail :any ;

  constructor( 
    private navCtrl: NavController,
    public callNumber: CallNumber,
    private alertCtrl :AlertController,
    private geolocation: Geolocation,
    private afDB: AngularFireDatabase

  ){  }

  ionViewDidLoad() {
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

            this.datas.servertime = firebase.database.ServerValue.TIMESTAMP;
            const itemsRef = this.afDB.list('requests');
            itemsRef.push(this.datas);


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

        this.datas.report_location.lat = resp.coords.latitude
        this.datas.report_location.lng = resp.coords.longitude

        var google_map_pos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        var google_maps_geocoder = new google.maps.Geocoder();
        google_maps_geocoder.geocode(
          { 'latLng': google_map_pos },
           (results, status) => {
            if (status == google.maps.GeocoderStatus.OK && results[0]) {
               var locationDetail:string = results[0].formatted_address;
              console.log(locationDetail);
              this.datas.report_locationDetail = locationDetail;   
            }
          }
        );
        
      })
      .catch((error) => {
        console.log('Error getting location', error);
      });
  }
}

class Datastructure {

  report_time = Date.now();
  report_location : Location = new Location(0,0);
  report_locationDetail = "";
  servertime : any ; 
  status = "UnRead";
  report_mode = "easy";
}



