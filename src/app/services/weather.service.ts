import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '688e0194da6c03bffd0a96d044ed401c'; // Replace with your actual API key
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getWeather(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
