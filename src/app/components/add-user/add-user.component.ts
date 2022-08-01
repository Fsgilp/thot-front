import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  confirma_password="";
  message = '';

  user: User = {
    email: '',
    name: '',
    surname: '',
    password: '',
    company: {},
    roles: [],
    isCompany: false,
    active: false
  };
  submitted = false;

/**
 * The constructor function is a special function that is called when a new instance of the class is
 * created.
 * @param {UserService} userService - UserService
 */
  constructor(private userService: UserService, private translateService: TranslateService, private router: Router) { }

  ngOnInit(): void {}

  /**
   * The function takes the user's email and name from the form and sends it to the server
   */
  saveUser(): void {
    const data = {
      email: this.user.email,
      name: this.user.name,
      surname: this.user.surname,
      password: this.user.password,
      company: this.user.company,
      isCompany: this.user.isCompany,
      roles: ["usuario"]
    };

    if(this.confirma_password==this.user.password){
      this.userService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          this.router.navigate(['/login']);
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

 /**
  * This function sets the submitted property to false, and sets the user property to an object with
  * three properties: email, name, and active.
  */
  newUser(): void {
    this.submitted = false;
    this.user = {
      email: '',
      name: '',
      surname: '',
      password: '',
      company: {},
      roles: [],
      isCompany: false,
      active: false
    };
  }

}
