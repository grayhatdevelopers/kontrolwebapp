import { Injectable, Inject, Component } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  header: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})

@Component({
  templateUrl: './popup-service.service.html',
  // styleUrls: ['./popup-service.service.css']
})

export class PopupService {
  constructor(
    public dialogRef: MatDialogRef<PopupService>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  let audio = new Audio();
  let name = 'popup'; 
  audio.src = "../../assets/audio/" + name + ".mp3";
  audio.load();
  audio.play();


  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}
