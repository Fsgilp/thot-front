import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, NgForm } from '@angular/forms'
import { ContactService } from 'src/app/services/contact.service';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  formData!: FormGroup;

  constructor(private builder: FormBuilder, private contact: ContactService) { }

  ngOnInit() {
    this.formData = this.builder.group({
      Fullname: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required]),
      Comment: new FormControl('', [Validators.required])
    });
  }

  onSubmit(formData:any) {
    console.log(FormData)
    this.contact.PostMessage(formData)
      .subscribe(response => {
        location.href = 'https://mailthis.to/confirm'
        console.log(response)
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      })
  }
}
