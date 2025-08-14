import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherDisplay } from './pages/weather-display/weather-display';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WeatherDisplay],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('weather');
}
