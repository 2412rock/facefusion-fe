import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService, SignInRequest, SignUpReq } from '../../services/auth.service';
import { LocalstorageService } from '../../services/shared-data.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService],
})
export class LoginComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  isRegistering = false;

  constructor(private authService: AuthService, private localStorageService: LocalstorageService, private router: Router){

  }

  async register(){
    this.loading = true;
    
      var req = new SignUpReq();
      req.password = this.password;
      req.email = this.email;
      firstValueFrom(this.authService.signUp(req)).then(e => {
        if(e.isSuccess){
          this.isRegistering = false;
        }
        else{

        }
        this.loading = false;
      }).catch(e => {this.loading = false;})
  }

  async login() {
      var req = new SignInRequest();
      req.email = this.email;
      req.password = this.password;
      this.localStorageService.setPassword(req.password);
      firstValueFrom(this.authService.signIn(req)).then(e => {
        if (e.isSuccess) {
          var bearer = e.data.bearerToken;
          var refresh = e.data.refreshToken;

          this.localStorageService.setBearer(bearer);
          this.localStorageService.setRefresh(refresh);
          this.localStorageService.setEmail(this.email);
          console.log("navigate to swap")
          this.router.navigate(['./swap'])
        }
        else {

        }
      }).catch(e => { console.log("Exception occured at signin" + e); })
    
  }



  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.password = '';
    this.confirmPassword = '';
  }

}
