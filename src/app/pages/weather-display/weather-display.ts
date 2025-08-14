import { Component } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-display',
  imports: [],
  templateUrl: './weather-display.html',
  styleUrl: './weather-display.scss',
  providers: [WeatherService],
})
export class WeatherDisplay {
  // eslint-disable-next-line
  weatherData: any;
  loading = true;
  // eslint-disable-next-line
  constructor(private weatherService: WeatherService) {
    this.weatherService.getWeather().subscribe((data) => {
      console.log(data);
      this.weatherData = data;
      this.loading = false;
    });
  }
}
