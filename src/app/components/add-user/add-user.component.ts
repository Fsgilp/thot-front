import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  user: User = {
    email: '',
    name: '',
    surname: '',
    password: '',
    company: {},
    roles: [],
    active: false
  };
  submitted = false;

/**
 * The constructor function is a special function that is called when a new instance of the class is
 * created.
 * @param {UserService} userService - UserService
 */
  constructor(private userService: UserService) { }

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
      roles: ["usuario"]
    };

    this.userService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
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
      active: false
    };
  }

}
