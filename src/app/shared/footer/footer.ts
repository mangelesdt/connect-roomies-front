import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {

  constructor(private translate: TranslateService) {
    this.translate.use('es');
  }
}
