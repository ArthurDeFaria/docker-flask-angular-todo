import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Home } from './pages/home/home';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Home,
    Home
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
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
