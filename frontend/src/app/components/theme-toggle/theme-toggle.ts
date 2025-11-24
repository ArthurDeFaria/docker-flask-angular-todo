import { Component } from '@angular/core';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrls: ['./theme-toggle.css']
})
export class ThemeToggleComponent {
  public theme$: Observable<Theme>;

  constructor(private themeService: ThemeService) {
    this.theme$ = this.themeService.currentTheme$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get Theme() {
    return Theme;
  }
}
