import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { DoTestComponent } from './components/do-test/do-test.component';
import { AdministrationComponent } from './administration/administration.component';
import { ExamenesComponent } from './examenes/examenes.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { LoginComponent } from './components/login/login.component';



const routes: Routes = [
  { path: '', redirectTo: 'tests', pathMatch: 'full' },
  { path: 'administration', component: AdministrationComponent },
  { path: 'tests', component: ExamenesComponent },
  { path: 'contact', component: ContactFormComponent },
  { path: 'profile', component: PerfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'tutorials/:id', component: TutorialDetailsComponent },
  { path: 'add', component: AddTutorialComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'user/add', component: AddUserComponent },
  { path: 'dotest/:id', component: DoTestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
