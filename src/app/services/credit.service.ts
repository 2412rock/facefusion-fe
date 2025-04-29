import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { Maybe } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  private apiUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.apiUrl = urlService.getHttpBaseUrl();
  }


  getCredit(){
    return this.http.get<Maybe<number>>(`${this.apiUrl}/api/credit`)
  }
}
