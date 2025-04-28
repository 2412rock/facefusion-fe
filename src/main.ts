import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';


import { CredentialsHttpInterceptor } from './app/interceptor/http-interceptor';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsHttpInterceptor,
      multi: true

    },
    provideHttpClient(
      withInterceptorsFromDi() // <-- Important: pull interceptors from DI, not manual new()
    ),
    provideRouter(routes) // if you have a router
  ]
});