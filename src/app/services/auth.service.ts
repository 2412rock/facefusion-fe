import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from '../services/url.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.apiUrl = urlService.getHttpBaseUrl();
  }


  userNameExists(username: string){
    return this.http.get<Maybe<boolean>>(`${this.apiUrl}/api/usernameExists?username=${username}`)
  }

  signUp(req: SignUpReq){
    return this.http.post<Maybe<boolean>>(`${this.apiUrl}/api/signup`, req)
  }

  signIn(req: SignInRequest){
    return this.http.post<Maybe<Tokens>>(`${this.apiUrl}/api/signin`, req)
  }
  
  continueAsGuest(){
    const req = new GuestReq();
    return this.http.post<Maybe<Tokens>>(`${this.apiUrl}/api/continueAsGuest`, req)
  }
  
  refreshToken(token: string): Observable<Maybe<string>>{
    return this.http.post<Maybe<string>>(`${this.apiUrl}/api/refreshToken`, {refreshToken: token});
  }

  canResetPassword(): Observable<Maybe<boolean>>{
    return this.http.get<Maybe<boolean>>(`${this.apiUrl}/api/canResetPassword`);
  }

  resetPassword(req: ResetPasswordRequest): Observable<Maybe<boolean>>{
    return this.http.put<Maybe<boolean>>(`${this.apiUrl}/api/resetPassword`, req);
  }

  deleteAccount(): Observable<Maybe<boolean>>{
    return this.http.delete<Maybe<boolean>>(`${this.apiUrl}/api/deleteAccount`);
  }

  sendVerificationCode(req: SendVerificationCodeRequest): Observable<Maybe<string>>{
    return this.http.post<Maybe<string>>(`${this.apiUrl}/api/sendVerificationCode`, req);
  }

  verifyCodeAndChangePassword(req: VerifyCodeAndChangePasswordRequest): Observable<Maybe<string>>{
    return this.http.put<Maybe<string>>(`${this.apiUrl}/api/verifyCodeAndChangePassword`, req);
  }
}

export class VerifyCodeAndChangePasswordRequest{
  public verificationCode: string;
  public username: string;
  public newPassword: string;
}

export class SendVerificationCodeRequest{
  public username: string;
}

export class ResetPasswordRequest{
  public oldPassword: string;
  public newPassword: string;
}

export class GuestReq{
  public isBot = false;
}

export class Maybe<T> {
  public data: T;

  public isSuccess: boolean;

  public isException: boolean;

  public exceptionMessage: string;
}

export class SignUpReq {
  public firstName: string;
  public lastName: string;
  public password: string;
  public email: string;
}

export class SignInRequest{
  public email: string;
  public password: string;
}


export class Tokens{
  public bearerToken: string;
  public refreshToken: string;
  public email: string;
}