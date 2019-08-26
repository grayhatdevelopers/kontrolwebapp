import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
// import moment = require('moment');
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class NotificationsService  implements OnInit {
  notificationsArray:string[] = [];
  constructor() {   
  }
  addInNotifications (color, title, message, url='', time){
    this.notificationsArray.push(title + " " + message + " at " + time);
  }

  showNotification(color, title, message, url=''){


    
      const type = ['','info','success','warning','danger'];
      const icon = ["notifications", "notifications", "done", "error_outline", "warning"];
      // const color = Math.floor((Math.random() * 4) + 1);
      this.playAudio(type[color]);
      this.addInNotifications(icon[color], title, message, url, moment().format("HH:mm"));
    


      $.notify({
          icon: icon[color],
          title: title,
          message: message,
          url: url
      },{
          type: type[color],
          timer: 4000,
          placement: {
              from: "top",
              align: "center"
          },
          template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
            '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
            `<i class="material-icons" data-notify="icon">${icon[color]}</i> ` +
            '<span data-notify="title">{1}</span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            '</div>' +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
          '</div>'
      });

  }

  playAudio(name:any){
    let audio = new Audio();
    audio.src = "../../assets/audio/" + name + ".mp3";
    audio.load();
    audio.play();
  }

  ngOnInit() {
  }
}
