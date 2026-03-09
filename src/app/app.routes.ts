import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { PublishComponent } from './pages/publish/publish';
import { AboutUsComponent } from './pages/about-us/about-us';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'publicar', component: PublishComponent },
  { path: 'sobre-nosotros', component: AboutUsComponent },
  { path: '**', redirectTo: '' }
];