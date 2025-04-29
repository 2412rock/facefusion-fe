import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocalstorageService } from './services/shared-data.service';
import { CredentialsHttpInterceptor } from './interceptor/http-interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsHttpInterceptor,
      multi: true
    }
  ]
})
export class AppComponent {
  constructor(private router: Router, private localStorage: LocalstorageService){

  }

  ngOnInit(){
    if(this.localStorage.getEmail()){
      this.router.navigate(['./swap'])
    }
    else{
      this.router.navigate(['./login'])
    }
   
  }
}
