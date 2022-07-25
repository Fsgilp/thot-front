import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  pregunta: any = {};

  constructor(private formBuilder: FormBuilder,     private tutorialService: TutorialService,
    private route: ActivatedRoute) {
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

  submitForm(){
    let correcto: boolean = true;
    let segunda_validacion: boolean = true;
    let count: number = 0;

    this.pregunta.answers.filter((d:any) => {
      console.log(d);
      this.form.value.checkArray.filter((s:string) => {
          console.log(s);
            if (d.answer === s && !d.correct) {
                correcto = false;
                segunda_validacion = false;
                return;
            }
        })
    });

    this.pregunta.answers.forEach((item: any) => {
      if(item.correct){
        count++;
      }
    });
    correcto = segunda_validacion && this.form.value.checkArray.length == count ? true: false;
    correcto ?  this.number_ok++ :  this.number_ko++;
  }

  timeLeft: number = 0;
  interval: any;
  display_time: string ='00:00';

  getTutorial(id: string): void {
    this.tutorialService.get(id)
      .subscribe({
        next: (data) => {
          this.currentTutorial = data;
          console.log(data);
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
