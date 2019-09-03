import { Routes } from '@angular/router';
import { LoginPageComponent } from 'app/pages/login-page/login-page.component';
import { GeneralComponent } from 'app/components_settings/general/general.component';
import { UsersComponent } from '../../components_settings/users/users.component'
import { TasksComponent } from 'app/components_settings/tasks/tasks.component';
import { CustomersComponent } from 'app/components_settings/customers/customers.component';
// import { SettingsPageComponent } from './settings-layout.component'

export const SettingsLayoutRoutes: Routes = [
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
    // { path: '',    component: LoginPageComponent 
    // children: [
    //     { path: 'general', component: LoginPageComponent },
    // ]
// }
    { path: 'general',        component: GeneralComponent },
    { path: 'users',        component: UsersComponent},
    { path: 'tasks',        component: TasksComponent},
    { path: 'customers',        component: CustomersComponent},
    { path: '', redirectTo: 'general', pathMatch: 'full'},
]; 
