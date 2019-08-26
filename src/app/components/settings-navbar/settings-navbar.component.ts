import { Component, OnInit, ElementRef } from '@angular/core';
// import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../../shared/notifications-service.service'
import { FirebaseService } from '../../shared/firebase.service'

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: 'general', title: 'General',  icon: 'change_history', class: '' },
    { path: 'users', title: 'Users',  icon:'supervised_user_circle', class: '' },
    { path: 'tasks', title: 'Tasks', icon: 'assignment', class: ''},
    { path: 'customers', title: 'Customers',  icon:'content_paste', class: '' },
    { path: 'companies', title: 'Companies',  icon:'library_books', class: '' },
    // { path: '/generate', title: 'Generate...',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/cheques', title: 'Manage Cheques',  icon:'receipt', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];


@Component({
  selector: 'settings-navbar',
  templateUrl: './settings-navbar.component.html',
  styleUrls: ['./settings-navbar.component.css']
})
export class SettingsNavbarComponent implements OnInit {
    private listTitles: any[];
    menuItems 
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    seenNotifications:boolean;

    constructor(
                private activatedRoute: ActivatedRoute,
                location: Location,  
                private element: ElementRef, 
                public notificationsService: NotificationsService, 
                private router: Router, 
                private firebaseService: FirebaseService) {
        this.location = location;
        this.sidebarVisible = false;
        // var state = activatedRoute.snapshot;
    }

    openNotifs(){
        this.seenNotifications=!this.seenNotifications;
        console.log("URL for this page...", this.activatedRoute.snapshot.url)  

    }
    // logOut() {
    //     console.log("logging out...");
    //     this.firebaseService.signOut().then((result) => {
    //         this.notificationsService.showNotification(1, 'Signed out successfully.', 'Take care!', '');      
    //         console.log("URL for this page...", this.activatedRoute.snapshot.url, "or", this.activatedRoute.url, "or", this.activatedRoute)  
    //         this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});

    //     }).catch((error) => {
    //         this.notificationsService.showNotification(4, 'Error while signing out.', error, '');
    //     })

    // }


    ngOnInit(){
    this.menuItems = ROUTES.filter(menuItem => menuItem);

      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
}
