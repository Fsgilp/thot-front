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
    active: false
  };
  submitted = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {}

  saveUser(): void {
    const data = {
      email: this.user.email,
      name: this.user.name
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

  newUser(): void {
    this.submitted = false;
    this.user = {
      email: '',
      name: '',
      active: false
    };
  }

}
