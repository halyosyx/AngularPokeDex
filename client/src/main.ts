import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SearchBarComponent } from './app/components/search-bar/search-bar.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
