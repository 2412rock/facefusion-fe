import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, firstValueFrom, from, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AuthService, SignInRequest } from "../services/auth.service";
import { LocalstorageService } from "../services/shared-data.service";


@Injectable()
export class CredentialsHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalstorageService,
    // private modalService: ModalService
  ) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("intercept")
    // You can modify the request here, add headers, etc.
    // For example, adding a custom header:
    if (request.headers.has('Skip-Interceptor')) {
      // Clone the request to remove the custom header
      const newReq = request.clone({
        headers: request.headers.delete('Skip-Interceptor')
      });
      return next.handle(newReq);
    }
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${this.localStorageService.getBearer()}`
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Handle 403 response, for example, redirect to a login page
          return from(this.refreshTokenAndRetry(request, next));
        }

        // Pass the error through to the calling code
        return throwError(error);
      })
    );
  }

  private navigateToLogin() {
    this.router.navigate(['./login']);
  }

  // Simulate refreshing the access token (replace with your actual logic)
  private refreshTokenAndRetry(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Call your token refresh service
    return this.authService.refreshToken(this.localStorageService.getRefresh() as string).pipe(
      switchMap(response => {
        if (response.isSuccess) {
          // If token refresh was successful, update the access token and re-run the request
          this.localStorageService.setBearer(response.data);
          const modifiedRequest = request.clone({
            setHeaders: {
              'Authorization': `Bearer ${response.data}`
            }
          });
          return next.handle(modifiedRequest);
        } else {
          // If token refresh failed, attempt to sign in again
          const req = new SignInRequest();
          req.email = this.localStorageService.getUsername() as string;
          req.password = this.localStorageService.getPassword() as string;

          return this.authService.signIn(req).pipe(
            switchMap(signInResponse => {
              if (signInResponse.isSuccess) {
                this.localStorageService.setBearer(signInResponse.data.bearerToken);
                this.localStorageService.setRefresh(signInResponse.data.refreshToken);

                const modifiedRequest = request.clone({
                  setHeaders: {
                    'Authorization': `Bearer ${signInResponse.data.bearerToken}`,
                  }
                });
                return next.handle(modifiedRequest);
              } else {
                this.router.navigate(['./login']);
                return throwError('Sign-in failed ' + signInResponse.exceptionMessage);
              }
            }),
            catchError((e) => {
              this.router.navigate(['./login']);
              return throwError('Sign-in failed ' + e.message);
            })
          );
        }
      }),
      catchError((error) => {
        this.router.navigate(['./login']);
        return throwError(error);
      })
    );


  }
}