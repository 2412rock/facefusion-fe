import { Routes } from '@angular/router';
import { SwapComponent } from './components/swap/swap.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'swap',
        component: SwapComponent
    },
];
