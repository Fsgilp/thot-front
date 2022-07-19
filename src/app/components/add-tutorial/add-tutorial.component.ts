/* The AddTutorialComponent class is a component class that contains the logic for the
add-tutorial.component.html template */
import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';

/* The AddTutorialComponent class is a component class
that contains the logic for the add-tutorial.component.html template. */
@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {

  keys:any=[];
  key:string="";

 /* Creating a new tutorial object. */
  tutorial: Tutorial = {
    title: '',
    description: '',
    published: false,
    crono: 0,
    questions: [],
    keys: [],
    attemps: 0,
    vote_ok: 0,
    vote_ko: 0,
    author:{}
  };
  submitted = false;

/**
 * The constructor function is a default function of the class that is executed when the class is
 * instantiated and ensures proper initialization of fields in the class and its subclasses.
 * @param {TutorialService} tutorialService - TutorialService
 */
  constructor(private tutorialService: TutorialService) { }

/**
 * It's a function that takes a string and returns a string.
 */
  ngOnInit(): void {
    // Bloque para eliminar error de SonarLint
  }

  addOption(){
    this.keys.push(this.key); // push your actutal string value
    this.key=""; //don't consider this, this is just for adding new name
  }

  removeOption(){
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] === this.key){
        this.keys.splice(i,1);
      }
     }
     this.key="";

  }


  /**
   * The function is called when the user clicks the submit button. It takes the data from the form and
   * sends it to the server
   */
  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description,
      crono: this.tutorial.crono,
      attemps: this.tutorial.attemps,
      keys: this.keys
    };

    this.tutorialService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  /**
   * The newTutorial() function resets the tutorial model, which clears the form
   */
  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false,
      crono: 0,
      questions: [],
      keys: [],
      attemps: 0,
      vote_ok: 0,
      vote_ko: 0,
      author:{}
    };
  }

}
