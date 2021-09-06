import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { GroupsComponent } from './groups/groups.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{path:'', component: LoginComponent}, {path:'groups', component: GroupsComponent}, {path:'controlpanel', component: ControlpanelComponent},];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
