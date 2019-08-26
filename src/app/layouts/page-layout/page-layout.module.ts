import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PageLayoutRoutes } from './page-layout.routing';
import { LoginPageComponent } from '../../pages/login-page/login-page.component'

// import { AngularFireModule } from '@angular/fire';
// import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
// import { environment } from '../../../environments/environment';


import {MAT_MOMENT_DATE_FORMATS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
// import {PopupService} from 'app/shared/popup-service.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import {MatTableModule} from '@angular/material/table'; 
import {MatSortModule} from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';


import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatExpansionModule,
  MatChipsModule

} from '@angular/material';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PopupService } from 'app/shared/popup-service.service';
// import { PapaParseModule } from 'papaparse';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PageLayoutRoutes),


    // AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule,


    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatCardModule
    // PapaParseModule,
    // AngularFirestore
  ],
  entryComponents: [
    // PopupService
  ],
  providers: [
    // {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        // AngularFirestore
  ],
  declarations: [
    LoginPageComponent,
    // PopupService
  ],
})

export class PageLayoutModule {}
