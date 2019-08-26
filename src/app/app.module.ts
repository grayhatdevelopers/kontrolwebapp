import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database'

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksPanelComponent } from './tasks/tasks-panel.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './generate/typography.component';
import { CustomerCardsComponent } from './customercards/customercards.component';
import { MapsComponent } from './maps/maps.component';
import {  } from './cheques/cheques-panel.component';
import { UpgradeComponent } from './pages/upgrade.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PageLayoutComponent } from './layouts/page-layout/page-layout.component';
import { SettingsLayoutComponent } from './layouts/settings-layout/settings-layout.component';
// import { GeneralComponent } from './components_settings/general/general/general.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDdC1qJU_73pzIorsUOypZ2sY6zgitSiYs'
    }),
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    PageLayoutComponent,
    SettingsLayoutComponent,
    // UsersComponent,
    // GeneralComponent,
    // LoginPageComponent,
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
