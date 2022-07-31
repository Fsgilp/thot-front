import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';

export interface Idioma {
  value: string;
  viewValue: string;
  img: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Thot Application';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  showModeratorBoard = false;
  username?: string;
  selectedLanguage = 'es';
  idiomas: Idioma[] = [
    { value: 'es', viewValue: 'IDIOMA.ESPANOL', img: 'https://www.akberiqbal.com/favicon-32x32.png' },
    { value: 'en', viewValue: 'IDIOMA.INGLES', img: 'https://www.akberiqbal.com/favicon-16x16.png' }
  ];

  constructor(
    public translate: TranslateService,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang(this.selectedLanguage);
    translate.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();
      },
      error: err => {
        console.log(err);
      }
    });

    window.location.reload();
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
  }
}
