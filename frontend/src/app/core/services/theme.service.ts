import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum Theme {
  Light = 'light-theme',
  Dark = 'dark-theme'
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>(Theme.Light);
  public currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      this.setTheme(Theme.Light);
    }
  }

  setTheme(theme: Theme) {
    document.body.classList.remove(this.currentTheme.value);
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
    this.currentTheme.next(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme.value === Theme.Light ? Theme.Dark : Theme.Light;
    this.setTheme(newTheme);
  }
}
