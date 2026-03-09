import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUsComponent {
  stats = [
    { value: '5,000+', label: 'aboutUs.stats.publishedProperties' },
    { value: '15,000+', label: 'aboutUs.stats.registeredStudents' },
    { value: '95%', label: 'aboutUs.stats.satisfaction' },
    { value: '24/7', label: 'aboutUs.stats.support' }
  ];

  features = [
    {
      title: 'aboutUs.features.search.title',
      description: 'aboutUs.features.search.description',
      icon: '⌕'
    },
    {
      title: 'aboutUs.features.security.title',
      description: 'aboutUs.features.security.description',
      icon: '🛡'
    },
    {
      title: 'aboutUs.features.communication.title',
      description: 'aboutUs.features.communication.description',
      icon: '◔'
    },
    {
      title: 'aboutUs.features.community.title',
      description: 'aboutUs.features.community.description',
      icon: '♡'
    }
  ];

  values = [
    {
      title: 'aboutUs.values.mission.title',
      description: 'aboutUs.values.mission.description',
      icon: '◎'
    },
    {
      title: 'aboutUs.values.community.title',
      description: 'aboutUs.values.community.description',
      icon: '◉'
    },
    {
      title: 'aboutUs.values.innovation.title',
      description: 'aboutUs.values.innovation.description',
      icon: '↗'
    }
  ];
}