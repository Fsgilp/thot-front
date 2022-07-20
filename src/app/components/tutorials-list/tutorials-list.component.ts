import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/services/tutorial.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {

  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  key = '';
  author = '';

  constructor(private tutorialService: TutorialService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  retrieveTutorials(): void {
    this.tutorialService.getAll()
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    if(confirm( this.translateService.instant(
      'GENERICO.MENSAJE_CONFIRMACIÓN'
    ))) {
      this.tutorialService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
    }
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
          this.title = "";
        },
        error: (e) => console.error(e)
      });
  }

  searchKey(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByKey(this.key)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
          this.key = "";

        },
        error: (e) => console.error(e)
      });
  }

  searchAuthor(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByAuthor(this.author)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
          this.author = "";

        },
        error: (e) => console.error(e)
      });
  }

}
