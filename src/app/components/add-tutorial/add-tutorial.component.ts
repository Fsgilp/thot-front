/* The AddTutorialComponent class is a component class that contains the logic for the
add-tutorial.component.html template */
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { MatTable } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

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
  pregunta:string="";
  respuesta:string="";
  correcta:boolean=false;
  questions:any=[];
  question:any={};
  answers:any=[];
  answer:any={};
  selectedLanguage:string="";
  languages:any = ["Español | Spanish", "Inglés | English"];

  columnas2: string[] = ['respuesta', 'correcta', 'borrar'];
  columnas: string[] = ['pregunta', 'borrar'];

  datos: Pregunta[] = [];
  datos2: Respuesta[] = [];

  @ViewChildren(MatTable) tablas !: QueryList<any>;
  @ViewChild('testTable1') preguntas!: MatTable<Pregunta>;
  @ViewChild('testTable2') respuestas!: MatTable<Respuesta>;

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
    correccionAutomatica: false,
    author:{},
    passed: 0
  };
  submitted = false;

/**
 * The constructor function is a default function of the class that is executed when the class is
 * instantiated and ensures proper initialization of fields in the class and its subclasses.
 * @param {TutorialService} tutorialService - TutorialService
 */
  constructor(private tutorialService: TutorialService, private translateService: TranslateService) { }

/**
 * It's a function that takes a string and returns a string.
 */
  ngOnInit(): void {
    // Bloque para eliminar error de SonarLint
  }

  onChange(newValue:string) {
    this.selectedLanguage = newValue;
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
      keys: this.keys,
      language: this.selectedLanguage,
      correccionAutomatica: this.tutorial.correccionAutomatica,
      questions: this.questions,
      passed: this.tutorial.passed
    };

    this.tutorialService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
          this.questions=[];
          this.datos=[];
          this.datos2=[];
          this.keys=[];
          this.selectedLanguage="";
          this.tablas.toArray().forEach(data => data.renderRows());
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
      language: "",
      correccionAutomatica: false,
      author:{},
      passed: 0
    };
  }

  borrarFila(cod: number) {
    if (confirm(this.translateService.instant(
      'PREGUNTAS.CONFIRMAR_BORRAR'
    ))) {
      this.questions.splice(cod, 1);
      this.datos.splice(cod, 1);
      this.tablas.toArray().forEach(data => data.renderRows());
    }
  }

  borrarFila2(cod: number) {
    if (confirm(this.translateService.instant(
      'PREGUNTAS.CONFIRMAR_BORRAR'
    ))) {
      this.answers.splice(cod, 1);
      this.datos2.splice(cod, 1);
      this.tablas.toArray().forEach(data => data.renderRows());

    }
  }

  agregar() {
    if (confirm(this.translateService.instant(
      'PREGUNTAS.CONFIRMAR_AGREGAR'
    ))) {
      this.datos.push(new Pregunta(this.pregunta));
      this.datos2= [];
      this.tablas.toArray().forEach(data => data.renderRows());
      this.questions.push({
        "question": this.pregunta,
        "answers": this.answers
      });
      this.answers=[];
      this.pregunta="";
    }
  }

  agregarRespuesta() {
    this.datos2.push(new Respuesta(this.respuesta, this.correcta));
    this.tablas.toArray().forEach(data => data.renderRows());
    this.answer={
      "answer": this.respuesta,
      "correct": this.correcta
    };
    this.answers.push(this.answer);
    this.respuesta="";
    this.correcta=false;
  }
}

export class Pregunta {
  constructor(public pregunta: string) {
  }
}

export class Respuesta {
  constructor(public respuesta: string, public correcta: boolean) {
  }
}

