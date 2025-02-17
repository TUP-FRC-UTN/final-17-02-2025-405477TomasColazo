import {Component, inject} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    AsyncPipe,
    RouterLink,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser$ = this.authService.currentUser$;


  getUserFirstName(username: string): string {
    const emailParts = username.split('@');
    return emailParts[0];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
