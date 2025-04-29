import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private bearer = "bearer";
  private refresh = "refresh";
  private username = "username";
  private password = "password";
  private email = "email";
  private idToken = "idToken";





  constructor() { }






  public setBearer(value: string){
    localStorage.setItem(this.bearer, value);
  }

  public setRefresh(value: string){
    localStorage.setItem(this.refresh, value);
  }



  public setPassword(value: string){
    localStorage.setItem(this.password, value);
  }

  public setEmail(value: string){
    localStorage.setItem(this.email, value);
  }

  public setIdToken(value: string){
    localStorage.setItem(this.idToken, value);
  }

  public getEmail(){
    return localStorage.getItem(this.email);
  }

  public getIdToken(){
    return localStorage.getItem(this.idToken);
  }

  public getPassword(){
    return localStorage.getItem(this.password);
  }

  public getUsername(){
    return localStorage.getItem(this.username);
  }

  public getBearer(){
    return localStorage.getItem(this.bearer);
  }

  public getRefresh(){
    return localStorage.getItem(this.refresh);
  }


  public removeEverything(){
    localStorage.removeItem(this.email);
    localStorage.removeItem(this.bearer);
    localStorage.removeItem(this.refresh);
    localStorage.removeItem(this.password);
    localStorage.removeItem(this.idToken);
  }
}
