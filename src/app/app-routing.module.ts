import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ControlpanelComponent } from './controlpanel/controlpanel.component';
import { GroupsComponent } from './groups/groups.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [{path:'', component: LoginComponent}, {path:'groups', component: GroupsComponent}, {path:'controlpanel', component: ControlpanelComponent}, {path:'chat/:group/:channel', component: ChatComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
