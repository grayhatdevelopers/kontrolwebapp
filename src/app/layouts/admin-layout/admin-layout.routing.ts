import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TasksPanelComponent } from '../../tasks/tasks-panel.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../generate/typography.component';
import { CustomerCardsComponent } from '../../customercards/customercards.component';
import { MapsComponent } from '../../maps/maps.component';
import { ChequesComponent } from '../../cheques/cheques-panel.component';
import { UpgradeComponent } from '../../pages/upgrade.component';

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
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'tasks',   component: TasksPanelComponent },
    { path: 'supplyofficers',     component: TableListComponent },
    { path: 'generate',     component: TypographyComponent },
    { path: 'customercards',          component: CustomerCardsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'cheques',  component: ChequesComponent },
    { path: 'signin',        component: UpgradeComponent },
    { path: '', redirectTo: 'signin', pathMatch: 'full'},
];
