import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-do-test',
  templateUrl: './do-test.component.html',
  styleUrls: ['./do-test.component.css']
})
export class DoTestComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  number_ok: number=0;
  number_ko: number=0;

  form: FormGroup;
  Data: Array<any> = [
    { id: 1, name: 'Pear', value: 'pear' },
    { id: 2, name: 'Plum', value: 'plum' },
    { id: 3, name: 'Kiwi', value: 'kiwi' },
    { id: 4, name: 'Apple', value: 'apple' },
    { id: 5, name: 'Lime', value: 'lime' },
  ];

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
    console.log("Llego submit");
    console.log(this.form.value);
  }

  timeLeft: number = 70;
  interval: any;
  display_time: string ='00:00';

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

  /*playPause() {
    const isPaused = !this.playPauseButton.classList.contains('running');
    if (isPaused) {
        this.playPauseButton.classList.add('running');
        this.start();
    } else {
        this.playPauseButton.classList.remove('running');
        this.pause();
    }
}

pause() {
    this.secondsSphere.style.animationPlayState = 'paused';
    clearInterval(this.stopwatchInterval);
}

stop() {
    this.secondsSphere.style.transform = 'rotate(-90deg) translateX(60px)';
    this.secondsSphere.style.animation = 'none';
    this.playPauseButton.classList.remove('running');
    this.runningTime = 0;
    clearInterval(this.stopwatchInterval);
    this.stopwatch.textContent = '00:00';
}

start() {
    this.secondsSphere.style.animation = 'rotacion 60s linear infinite';
    let startTime = Date.now() - this.runningTime;
    this.secondsSphere.style.animationPlayState = 'running';
    this.stopwatchInterval = setInterval( () => {
        this.runningTime = Date.now() - startTime;
        this.stopwatch.textContent = this.calculateTime(this.runningTime);
    }, 1000)
}

calculateTime(runningTime:number) {
    const total_seconds = Math.floor(runningTime / 1000);
    const total_minutes = Math.floor(total_seconds / 60);

    const display_seconds = (total_seconds % 60).toString().padStart(2, "0");
    const display_minutes = total_minutes.toString().padStart(2, "0");

    return `${display_minutes}:${display_seconds}`
}*/

}
