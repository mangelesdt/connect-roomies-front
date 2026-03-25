import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { PublishComponent } from './pages/publish/publish';
import { AboutUsComponent } from './pages/about-us/about-us';
import { PropertyDetailComponent } from './pages/property-detail/property-detail';
import { authGuard } from './core/guards/auth-guard';
import { publishGuard } from './core/guards/rol-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'publicar', component: PublishComponent, canActivate: [publishGuard] },
  { path: 'sobre-nosotros', component: AboutUsComponent },
  { path: 'vivienda/:id', component: PropertyDetailComponent },
  { path: '**', redirectTo: '' }
];