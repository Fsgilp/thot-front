import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from '../../models/tutorial.model';

@Component({
  selector: 'app-do-test',
  templateUrl: './do-test.component.html',
  styleUrls: ['./do-test.component.css']
})
export class DoTestComponent implements OnInit {

  currentTutorial: Tutorial={};
  totalPreguntas:number=0;
  conteoPreguntas:number=1;
  pregunta: any = {};
  contestadas = new Map();

  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private router: Router
    ) {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([], [Validators.required]),
    });
    this.getTutorial(this.route.snapshot.params["id"]);
  }

  ngOnInit(): void {

  }

  number_ok: number=0;
  number_ko: number=0;

  form: FormGroup;

  onCheckboxChange(e:any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  next(_currentTutorial:Tutorial){
    if(this.conteoPreguntas<this.totalPreguntas){
      this.conteoPreguntas=this.conteoPreguntas+1;
      this.pregunta = _currentTutorial.questions?_currentTutorial.questions[this.conteoPreguntas-1]:{};
    }else {
      this.conteoPreguntas = 1;
      console.log("Next:" + this.conteoPreguntas);
      this.pregunta = _currentTutorial.questions?_currentTutorial.questions[this.conteoPreguntas-1]:{};
    }
  }

  enviar(_currentTutorial:Tutorial){
    if(confirm(this.translateService.instant('EXAMEN.MENSAJE_ENVIAR'))) {
      console.log("Enviando el examen");
      this.router.navigate(['/tests']);
    }

  }

  submitForm(_currentTutorial:Tutorial){
    let correcto: boolean = true;
    let segunda_validacion: boolean = true;
    let count: number = 0;
    this.contestadas.set(this.pregunta._id,true);
    //this.conteoPreguntas = this.conteoPreguntas+1;

    this.pregunta.answers.filter((d:any) => {
      console.log(d);
      this.form.value.checkArray.filter((s:string) => {
          console.log(s);
            if (d._id === s && !d.correct) {
                console.log("d._id === s.Entro aqui");
                correcto = false;
                segunda_validacion = false;
                return;
            }
        })
    });

    this.pregunta.answers.forEach((item: any) => {
      if(item.correct){
        count=count+1;
      }
    });
    console.log("Respuestas v??lidas:" + count);
    console.log("Respuestas contestadas:" + this.form.value.checkArray.length);

    correcto = segunda_validacion && this.form.value.checkArray.length == count ? true: false;
    correcto ?  this.number_ok++ :  this.number_ko++;
    //REINICIAR PARA SIGUIENTE PREGUNTA
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([], [Validators.required]),
    });
    segunda_validacion = true;
    count=0;
    this.uncheckAll();
    if(this.conteoPreguntas<this.totalPreguntas){
      this.conteoPreguntas=this.conteoPreguntas+1;
      this.pregunta = _currentTutorial.questions?_currentTutorial.questions[this.conteoPreguntas-1]:{};
    }else{
      this.conteoPreguntas = 1;
      console.log("Next:" + this.conteoPreguntas);
      this.pregunta = _currentTutorial.questions?_currentTutorial.questions[this.conteoPreguntas-1]:{};
    }

  }

  timeLeft: number = 0;
  interval: any;
  display_time: string ='00:00';

  getTutorial(id: string): void {
    this.tutorialService.get(id)
      .subscribe({
        next: (data) => {
          this.currentTutorial = data;
          this.totalPreguntas = this.currentTutorial.questions? this.currentTutorial.questions.length:0;
          this.pregunta = this.currentTutorial.questions?.find(element => element != undefined);
          this.timeLeft = this.currentTutorial.crono? this.currentTutorial.crono:0;
          this.startTimer();
        },
        error: (e) => console.error(e)
      });
  }

  startTimer() {
    if(!this.interval){
      this.interval = setInterval(() => {
        if(this.timeLeft > 0) {
          this.timeLeft--;
          this.display_time = this.calculateTime(this.timeLeft);
        } else {
          this.stop();
        }
      },1000)
    }
  }

  pauseTimer() {
    this.display_time = this.calculateTime(this.timeLeft);
    clearInterval(this.interval);
  }

  stop() {
    this.timeLeft = 0;
    this.display_time = this.calculateTime(this.timeLeft);
    clearInterval(this.interval);
    this.interval=null;
}

calculateTime(runningTime:number) {
  const total_minutes = Math.floor(runningTime / 60);

  const display_seconds = (runningTime % 60).toString().padStart(2, "0");
  const display_minutes = total_minutes.toString().padStart(2, "0");

  return display_minutes+":"+display_seconds;
}

}
