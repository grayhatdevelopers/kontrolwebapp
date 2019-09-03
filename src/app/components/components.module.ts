import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop'; 


import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SettingsNavbarComponent } from './settings-navbar/settings-navbar.component'


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SettingsNavbarComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SettingsNavbarComponent,
  ]
})
export class ComponentsModule { }
