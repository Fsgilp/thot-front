import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  confirma_password="";

  @Input() viewMode = false;

  @Input() currentUser: User = {
    email: '',
    name: '',
    surname: '',
    password: '',
    company: {},
    roles: [],
    isCompany: false,
    active: false
  };

  message = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getUser(this.route.snapshot.params["id"]);
    }
  }

  getUser(id: string): void {
    this.userService.get(id)
      .subscribe({
        next: (data) => {
          this.currentUser = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updateActive(status: boolean): void {
    const data = {
      email: this.currentUser.email,
      name: this.currentUser.name,
      active: status,
      isCompany: this.currentUser.isCompany
    };

    this.message = '';

    this.userService.update(this.currentUser.id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentUser.active = status;
          this.message = this.translateService.instant('USUARIOS.MENSAJE_EDICION');
        },
        error: (e) => console.error(e)
      });
  }

  updateUser(): void {
    this.message = '';
    if(this.confirma_password==this.currentUser.password){
      this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe({
        next: (res) => {
          this.message = this.translateService.instant('USUARIOS.MENSAJE_EDICION');
          this.confirma_password = "";
        },
        error: (e) => console.error(e)
      });
    }
    else{
      this.message = this.translateService.instant(
        'USUARIOS.PASSWORD_NO_COINCIDE'
      );
    }

  }

  deleteUser(): void {
    this.userService.delete(this.currentUser.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/administration']);
        },
        error: (e) => console.error(e)
      });
  }

}
