import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar";
import { FooterComponent } from "./shared/footer/footer";
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('connect-roomies-front');

  showHeaderFooter = true;
  appReady = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(() => {
      const hiddenRoutes = ['/login', '/registro'];
      this.showHeaderFooter = !hiddenRoutes.includes(this.router.url);
    });
  }

  ngOnInit(): void {
    this.authService.restoreSession();
    this.appReady = true;
  }
}
