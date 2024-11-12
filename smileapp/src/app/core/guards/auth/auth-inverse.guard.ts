import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';

export const authInverseGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated())
  {
    const userRole = authService.getUser();
    if (userRole?.role==='DENTIST')
    {
      router.navigate(['/patient']);
    } else if (userRole?.role==='PATIENT'){
      router.navigate(['/patient'])
    }
    return false;
  }
  return true;
};
