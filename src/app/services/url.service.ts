import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private devMode = isDevMode();
    private apiUrl = 'http://10.242.118.39:5500'

    //  private apiUrl = this.devMode ? 'http://10.242.118.39:4600' : 'https://overflowapp.xyz:4600';
    //  private sockerService = this.devMode ? "ws://10.242.118.39:4600/ws/" : 'wss://overflowapp.xyz:4600/ws/';
  constructor() { }

  public getHttpBaseUrl(){
    return this.apiUrl;
  }

}
