import { MainPage } from './../main/main';
import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController, AlertController } from 'ionic-angular'
import { Geolocation } from '@ionic-native/geolocation';
import { Location } from './../../models/location';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { CallNumber } from '@ionic-native/call-number';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: Observable<any[]>;
  telNumber: string = "";
  base64Image: string = 'assets/imgs/camera.jpg';
  location: Location = {
    lat: 18.771739,
    lng: 98.8864364
  }

  locationIsSet: boolean = false;

  imageDisplay: string;

  constructor(
    private navCtrl: NavController,
    private geolocation: Geolocation,
    private loadCtrl: LoadingController,
    private toasCtrl: ToastController,
    private camera: Camera,
    private afDB: AngularFireDatabase,
    public alertCtrl: AlertController,
    private callNumber: CallNumber

  ) {
  }
  ionViewDidLoad() {
    this.onLocation();
  }

  datas: Datastructure = new Datastructure();

  onSubmit() {

    let confirm = this.alertCtrl.create({
      title: 'คุณต้องการโทรแจ้ง 1669',
      message: ` เบอร์โทรคุณ :${this.telNumber}`,
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
            this.datas.report_telNumber = this.telNumber;
            const itemsRef = this.afDB.list('requests');
            itemsRef.push(this.datas);

            this.callNumber.callNumber("1669", true)
            this.navCtrl.push(MainPage);

          }
        }
      ]
    });
    confirm.present();
  }

  showAlertTx() {

    let alert = this.alertCtrl.create({
      title: 'แจ้งเหตุเรียบร้อย',
      subTitle: 'ขอขอบคุณพระอย่างยิ่ง',
      buttons: ['OK']
    });
    alert.present();

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
        this.locationIsSet = true;

        this.datas.report_location.lat = resp.coords.latitude
        this.datas.report_location.lng = resp.coords.longitude

        console.log(this.datas.report_location)

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

        loader.dismiss();
        const toast = this.toasCtrl.create({
          message: 'Could not get location, please pick it manually!',
          duration: 2500
        })
        toast.present();
      });
  }
  
  OnTakePhoto() {

    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log(imageData)

      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.datas.report_image = this.base64Image;
      console.log(this.base64Image)

      this.imageDisplay = this.base64Image;
    }, (err) => {
      // Handle error
    });
  }

  onRefresh() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.showAlertTx();

  }

}

class Datastructure {

  report_time = Date.now();
  report_telNumber = "";
  report_image = "";
  report_location : Location = new Location(0,0);
  report_locationDetail = "";

}


