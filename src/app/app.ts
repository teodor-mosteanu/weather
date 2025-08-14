import { Component, signal } from '@angular/core';
import { WeatherDisplay } from './pages/weather-display/weather-display';

@Component({
  selector: 'app-root',
  imports: [WeatherDisplay],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('weather');
}
