import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

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
  isAdmin = false;
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
    private storageService: StorageService,
    private userService: UserService
  ) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang(this.selectedLanguage);
    translate.use(this.selectedLanguage);
    this.userService.findOrCreateAdmin()
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => console.error(e)
      });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    console.log("ADMIN: "  + this.storageService.isAdmin());
    this.isAdmin = this.storageService.isAdmin();
  }

  logout(): void {
    this.storageService.clean();
    window.location.reload();
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
  }
}
