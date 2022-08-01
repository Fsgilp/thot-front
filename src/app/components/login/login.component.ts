import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showModal: boolean=true;
  registerForm: FormGroup;
  submitted = false;
  userAux:User=new User();

  constructor(private formBuilder: FormBuilder,  private router: Router, private authService: AuthService, private storageService: StorageService) {
    let user = this.storageService.getUserLocal();
    if(user.email){
      this.userAux.email=user.email;
      this.userAux.password=user.password;
    }
  }

  show()
  {
    this.showModal = true; // Show-Hide Modal Check

  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
    this.router.navigate(['/tests']);

  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberme: ['', []]
    });
}
// convenience getter for easy access to form fields
get f() { return this.registerForm.controls; }
onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    if(this.submitted)
    {
      this.authService.login(this.registerForm.value.email,this.registerForm.value.password)
      .subscribe({
        next: (res) => {
          console.log(res);
          if(res.length==0){
            alert("No existe usuario en bbdd");
            return;
          } else {
            if(this.registerForm.value.rememberme){
              this.storageService.saveUserLocal(res[0]);
            }
            this.storageService.saveUser(res[0]);

            this.showModal = false;
            this.router.navigate(['/tests']);
            window.location.reload();
          }
        },
        error: (e) => console.error(e)
      });
    }

}

irRegistro(){
  this.router.navigate(['/user/add']);
}

}
