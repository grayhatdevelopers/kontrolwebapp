import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FirebaseService } from '../../shared/firebase.service';
import { NotificationsService } from '../../shared/notifications-service.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  submit_login = false;
  returnUrl: string;
  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    public notificationsService: NotificationsService,
    private formBuilder: FormBuilder, 
    private firebaseService: FirebaseService) { 
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }


  clickButton(){
    this.submit_login=true;
    console.log("Hello beast", this.f['username'].value, this.f['password'].value);
    let reference:any;
    // this.notificationsService.showNotification(1, 'Testing...', '', '')
    reference=this.firebaseService.signIn(this.f['username'].value,this.f['password'].value);
    reference.then( (result) => {
      // setTimeout(a =>{ 
        
        // alert("Hello"); 
        this.notificationsService.showNotification(1, 'Welcome back!', 'Enjoy your day of productivity.', 'dashboard');
        // this.router.navigate(['dashboard']);
        console.log("The URL is", this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);

        // console.log("How long can this last");
      // }, 1000);
      

    }).catch(error => {
      // Handle Errors here.
      
      var errorCode = error.code;
      var errorMessage = error.message;
      this.notificationsService.showNotification(4, 'Encountered an error while signing in.', `${errorCode}: ${errorMessage}`, '');

      // ...
    });
    this.submit_login=false;
  }

}
