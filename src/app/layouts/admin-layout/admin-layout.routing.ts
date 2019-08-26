import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TasksPanelComponent } from '../../tasks/tasks-panel.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../generate/typography.component';
import { CustomerCardsComponent } from '../../customercards/customercards.component';
import { MapsComponent } from '../../maps/maps.component';
import { ChequesComponent } from '../../cheques/cheques-panel.component';
// import { UpgradeComponent } from '../../pages/upgrade.component';
// import { LoginPageComponent } from '../../pages/login-page/login-page.component'
import { LoginGuard } from './login.guard';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: CustomerCardsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent, canActivate:[LoginGuard] },
    { path: 'tasks',   component: TasksPanelComponent, canActivate:[LoginGuard] },
    { path: 'supplyofficers',     component: TableListComponent, canActivate:[LoginGuard] },
    { path: 'generate',     component: TypographyComponent, canActivate:[LoginGuard] },
    { path: 'customercards',          component: CustomerCardsComponent, canActivate:[LoginGuard] },
    { path: 'maps',           component: MapsComponent, canActivate:[LoginGuard] },
    { path: 'cheques',  component: ChequesComponent, canActivate:[LoginGuard] },
    // { path: 'login',        component: LoginPageComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
]; 
