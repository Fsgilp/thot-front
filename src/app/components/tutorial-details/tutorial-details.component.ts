import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent implements OnInit {
  mensaje="";
  keys: any = [];
  keys_eliminar: any = [];
  key: string = '';
  totalPreguntas: number = 0;
  selectedLanguage: string = '';
  languages: any = ['Español | Spanish', 'Inglés | English'];
  currentUser: User = new User();
  isLogged:boolean = false;

  @Input() viewMode = false;
  @Input() admin: boolean = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    crono: 0,
    attemps: 0,
    author: {},
    published: false,
    correccionAutomatica: false,
    questions: [],
  };

  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService
  ) {
    this.isLogged = this.storageService.isLoggedIn();
  }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
    this.currentUser = this.storageService.getUser();
  }

  onChange(newValue: string) {
    this.selectedLanguage = newValue;
  }

  addOption() {
    this.keys.push(this.key); // push your actutal string value
    this.key = ''; //don't consider this, this is just for adding new name
  }

  removeOption() {
    /*for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] === this.key){
        this.keys.splice(i,1);
      }
     }*/
    this.keys_eliminar.push(this.key); // push your actutal string value
    this.key = '';
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
        this.totalPreguntas = this.currentTutorial.questions
          ? this.currentTutorial.questions.length
          : 0;
      },
      error: (e) => console.error(e),
    });
  }

  updatePublished(status: boolean): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      crono: this.currentTutorial.crono,
      attemps: this.currentTutorial.attemps,
      author: this.currentTutorial.author,
      keys: this.currentTutorial.keys,
      questions: this.currentTutorial.questions,
      language: this.currentTutorial.language,
      correccionAutomatica: this.currentTutorial.correccionAutomatica,
      published: status,
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.currentTutorial.published = status;
        this.message = res.message
          ? res.message
          : this.translateService.instant('EXAMENES.MENSAJE_STATUS');
      },
      error: (e) => console.error(e),
    });
  }

  updateTutorial(): void {
    this.message = '';
    console.log(this.currentTutorial.keys);
    console.log(this.keys);
    this.currentTutorial.keys != this.currentTutorial.keys?.concat(this.keys);
    console.log(this.currentTutorial.keys);

    this.tutorialService
      .update(this.currentTutorial.id, this.currentTutorial)
      .subscribe({
        next: (res) => {
          console.log(res);
          let devolucion: string = res.message;
          if (devolucion == 'Tutorial was updated successfully.') {
            this.message = this.translateService.instant(
              'EXAMENES.MENSAJE_EDICION'
            );
          } else {
            this.message = devolucion;
          }
        },
        error: (e) => console.error(e),
      });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tests']);
      },
      error: (e) => console.error(e),
    });
  }

  apuntarse(id: number): void {
    let tutorialAux: Tutorial;

    if (this.currentUser.isCompany) {
      return;
    } else {
      this.tutorialService.get(id).subscribe({
        next: (data2) => {
          tutorialAux = data2;
          tutorialAux.pass=false;
          this.userService.findByEmail(this.currentUser.email).subscribe({
            next: (data) => {
              this.currentUser = data[0];
              //---- Bloque para comprobar que el examen no esté ya apuntado el usuario
              let tests = this.currentUser.tests?this.currentUser.tests:[];
              for (let index = 0; index < tests.length; index++) {
                const titleAux = tests[index].title;
                if(titleAux==tutorialAux.title){
                  alert(this.translateService.instant('EXAMENES.MENSAJE_EXAMEN_APUNTADO'));
                  return;
                }
              }
              //----
              tutorialAux.id=id;
              this.currentUser.tests?.push(tutorialAux);
              this.userService
                .update(this.currentUser.id, this.currentUser)
                .subscribe({
                  next: (data2) => {
                    this.storageService.saveUser(this.currentUser);
                  },
                  error: (e) => console.error(e),
                });
            },
            error: (e) => console.error(e),
          });
        },
        error: (e) => console.error(e),
      });
    }
  }
}
