// Edite este arquivo: frontend/src/app/app.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    // RouterOutlet, 
    HttpClientModule
  ],
  templateUrl: './app.html', // <-- O importante é que este nome bata com o seu arquivo HTML
  styleUrls: ['./app.css']   // <-- E este nome com o seu arquivo de estilo
})
export class AppComponent implements OnInit {
  title = 'frontend';
  messageFromApi = 'Carregando...';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ message: string }>('http://localhost:5000/api/message').subscribe(data => {
      this.messageFromApi = data.message;
    });
  }
}