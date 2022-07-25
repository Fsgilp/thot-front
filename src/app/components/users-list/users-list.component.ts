import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  _admin = false;
  users?: User[];
  currentUser: User = {};
  currentIndex = -1;
  email = '';
  rol = '';
  company_name = '';

  constructor(private userService: UserService,
    private translateService: TranslateService) { }

    @Input()
  set admin(param:string) {   // this is setter for booleanCheck input.
    this._admin = true;
  }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.userService.getAll()
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveUsers();
    this.currentUser = {};
    this.currentIndex = -1;
  }

  setActiveUser(user: User, index: number): void {
    this.currentUser = user;
    this.currentIndex = index;
  }

  removeAllUsers(): void {
    if(confirm( this.translateService.instant(
      'GENERICO.MENSAJE_CONFIRMACIÓN'
    ))) {
      this.userService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
    }
  }

  searchEmail(): void {
    this.currentUser = {};
    this.currentIndex = -1;

    this.userService.findByEmail(this.email)
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(data);
          this.email = "";
        },
        error: (e) => console.error(e)
      });
  }

  searchCompany(): void {
    this.currentUser = {};
    this.currentIndex = -1;

    this.userService.findByCompany(this.company_name)
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(data);
          this.company_name = "";
        },
        error: (e) => console.error(e)
      });
  }

  searchRol(): void {
    this.currentUser = {};
    this.currentIndex = -1;

    this.userService.findByRole(this.rol)
      .subscribe({
        next: (data) => {
          this.users = data;
          console.log(data);
          this.rol = "";
        },
        error: (e) => console.error(e)
      });
  }

}
