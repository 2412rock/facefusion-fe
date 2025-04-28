import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocalstorageService } from './services/shared-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private router: Router, private localStorage: LocalstorageService){

  }

  ngOnInit(){
    if(this.localStorage.getEmail() != null){
      this.router.navigate(['./swap'])
    }
    else{
      this.router.navigate(['./login'])
    }
   
  }
}
