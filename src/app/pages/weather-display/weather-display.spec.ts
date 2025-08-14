import { TestBed, ComponentFixture } from '@angular/core/testing';
import { WeatherDisplay } from './weather-display';
import { WeatherService } from '../../services/weather.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('WeatherDisplay', () => {
  let component: WeatherDisplay;
  let fixture: ComponentFixture<WeatherDisplay>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;

  const mockWeatherData = {
    name: 'London',
    main: {
      temp: 22.5,
      feels_like: 20.3,
    },
    weather: [
      {
        description: 'partly cloudy',
      },
    ],
  };

  beforeEach(async () => {
    // Create spy object for WeatherService
    mockWeatherService = jasmine.createSpyObj('WeatherService', ['getWeather']);

    await TestBed.configureTestingModule({
      imports: [WeatherDisplay],
      providers: [
        // Override the WeatherService provider in the component
        { provide: WeatherService, useValue: mockWeatherService },
      ],
    })
      // Override component providers to use our mock
      .overrideComponent(WeatherDisplay, {
        set: {
          providers: [{ provide: WeatherService, useValue: mockWeatherService }],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    // Setup default mock behavior
    mockWeatherService.getWeather.and.returnValue(of(mockWeatherData));

    fixture = TestBed.createComponent(WeatherDisplay);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should call weather service on construction', () => {
      fixture.detectChanges();
      expect(mockWeatherService.getWeather).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('should display loading message when loading is true', () => {
      // Set loading to true and detect changes
      component.loading = true;
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('p'));
      expect(loadingElement).toBeTruthy();
      expect(loadingElement.nativeElement.textContent.trim()).toBe('Loading...');
    });

    it('should not display weather data when loading', () => {
      component.loading = true;
      fixture.detectChanges();

      const weatherElements = fixture.debugElement.queryAll(By.css('h1'));
      expect(weatherElements.length).toBe(0);
    });
  });

  describe('Weather Data Display', () => {
    beforeEach(() => {
      fixture.detectChanges(); // This will trigger the service call and set loading to false
    });

    it('should set loading to false after successful data fetch', () => {
      expect(component.loading).toBe(false);
    });

    it('should store weather data after successful fetch', () => {
      expect(component.weatherData).toEqual(mockWeatherData);
    });

    it('should display the main heading when not loading', () => {
      const headingElement = fixture.debugElement.query(By.css('h1'));
      expect(headingElement).toBeTruthy();
      expect(headingElement.nativeElement.textContent.trim()).toBe(
        'This app is just a demonstrator for exemplifying CI/CD pipeline workflow'
      );
    });

    it('should display city name and temperature', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      const tempParagraph = paragraphs.find((p) =>
        p.nativeElement.textContent.includes('weather in')
      );

      expect(tempParagraph).toBeTruthy();
      expect(tempParagraph!.nativeElement.textContent.trim()).toBe(
        'The weather in London is 22.5°C'
      );
    });

    it('should display feels like temperature', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      const feelsLikeParagraph = paragraphs.find((p) =>
        p.nativeElement.textContent.includes('feels like')
      );

      expect(feelsLikeParagraph).toBeTruthy();
      expect(feelsLikeParagraph!.nativeElement.textContent.trim()).toBe('It feels like 20.3°C');
    });

    it('should display weather description', () => {
      const paragraphs = fixture.debugElement.queryAll(By.css('p'));
      const descriptionParagraph = paragraphs.find((p) =>
        p.nativeElement.textContent.includes('Weather description')
      );

      expect(descriptionParagraph).toBeTruthy();
      expect(descriptionParagraph!.nativeElement.textContent.trim()).toBe(
        'Weather description: partly cloudy'
      );
    });

    it('should display all weather information elements', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent).toContain('London');
      expect(compiled.textContent).toContain('22.5°C');
      expect(compiled.textContent).toContain('20.3°C');
      expect(compiled.textContent).toContain('partly cloudy');
    });
  });

  describe('Error Handling', () => {
    it('should handle service error gracefully', () => {
      // Reset the fixture to test error scenario
      mockWeatherService.getWeather.and.returnValue(throwError(() => new Error('Service error')));

      // Create a new component instance
      const errorFixture = TestBed.createComponent(WeatherDisplay);
      const errorComponent = errorFixture.componentInstance;

      // The component should still be created even if service fails
      expect(errorComponent).toBeTruthy();
      expect(errorComponent.loading).toBe(true); // Should remain in loading state
      expect(errorComponent.weatherData).toBeUndefined();
    });
  });

  describe('Template Conditional Rendering', () => {
    it('should show loading template when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const loadingElement = fixture.debugElement.query(By.css('p'));
      const headingElement = fixture.debugElement.query(By.css('h1'));

      expect(loadingElement.nativeElement.textContent.trim()).toBe('Loading...');
      expect(headingElement).toBeNull();
    });

    it('should show weather template when loading is false', () => {
      component.loading = false;
      component.weatherData = mockWeatherData;
      fixture.detectChanges();

      const headingElement = fixture.debugElement.query(By.css('h1'));
      const loadingElement = fixture.debugElement.query(By.css('p'));

      expect(headingElement).toBeTruthy();
      // The first p element should now be weather info, not loading
      expect(loadingElement.nativeElement.textContent).not.toBe('Loading...');
    });
  });
});
