import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { PublishComponent } from './pages/publish/publish';
import { AboutUsComponent } from './pages/about-us/about-us';
import { PropertyDetailComponent } from './pages/property-detail/property-detail';
import { authGuard } from './core/guards/auth-guard';
import { publishGuard } from './core/guards/rol-guard';
import { loginGuard } from './core/guards/login-guard';
import { ProfileComponent } from './pages/profile/profile';
import { EditProfileComponent } from './pages/edit-profile/edit-profile';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password';

export const routes: Routes = [
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'registro', component: RegisterComponent, canActivate: [loginGuard] },
  { path: 'recuperar-password', component: RecoverPasswordComponent, canActivate: [loginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'publicar', component: PublishComponent, canActivate: [publishGuard] },
  { path: 'publicar/:id', component: PublishComponent, canActivate: [publishGuard] },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'perfil/editar', component: EditProfileComponent, canActivate: [authGuard] },
  { path: 'sobre-nosotros', component: AboutUsComponent },
  { path: 'vivienda/:id', component: PropertyDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }

];