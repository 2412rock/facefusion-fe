import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InputValidatorService {

  constructor(private authService: AuthService) { }

  async checkIfUsernameExists(username: string): Promise<boolean> {
    const result = await firstValueFrom(this.authService.userNameExists(username));
    if (result.isSuccess) {
      return result.data;
    }
    return false;
  }

  filterAlphanumericAndLimitLength(event: Event): string {
    const inputElement = event.target as HTMLInputElement;
    
    // Replace any non-alphanumeric characters
    const filteredValue = inputElement.value.replace(/[^a-zA-Z0-9._-]/g, '');
  
    // Update the input field and model with the filtered value
    inputElement.value = filteredValue;
    return filteredValue;
  }

  filterEmail(event: Event): string {
    const inputElement = event.target as HTMLInputElement;
    
    // Replace any non-alphanumeric characters
    const filteredValue = inputElement.value.replace(/[^a-zA-Z0-9.@]/g, '');

    // Update the input field and model with the filtered value
    inputElement.value = filteredValue;
    return filteredValue;
  }

  filterPasswordCharacters(event: Event): string {
    const inputElement = event.target as HTMLInputElement;
    
    // Replace any non-alphanumeric characters
    const filteredValue = inputElement.value.replace(/[^A-Za-z0-9!@#$%^&*()\-_=\[\]{};:'",<.>/?|\\~`+]/g, '');
  
    // Update the input field and model with the filtered value
    inputElement.value = filteredValue;
    return filteredValue;
  }
}
