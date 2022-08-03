import { StorageService } from 'src/app/services/storage.service';
import { MatTable } from '@angular/material/table';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User } from 'src/app/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  confirma_password="";
  message="";
  currentUser: any;
  datos: Tutorial[] = [];
  datos2: User[] = [];
  columnas: string[] = ['test','language','passed',"attemps","retry","download"];
  columnas2: string[] = ['nombre','email',"test","passed","attemps","download"];

  @ViewChildren(MatTable) tablas!: QueryList<any>;
  @ViewChild('testTable1') tests!: MatTable<Tutorial>;
  @ViewChild('testTable2') users!: MatTable<User>;

  constructor(private storageService: StorageService,
    private translateService: TranslateService,
    private userService: UserService,
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
    if(this.currentUser.isCompany){

    }else{
      this.userService.findByEmail(this.currentUser.email)
      .subscribe({
        next: (data) => {
          this.currentUser = data[0];
          this.storageService.saveUser(this.currentUser);
        },
        error: (e) => console.error(e)
      });
    this.datos = this.currentUser.tests;
    }

    if(this.tablas){
      this.tablas.toArray().forEach(data => data.renderRows());
    }

  }

  public openPDF(test:Tutorial): void {
    let DATA: any = document.getElementById('tablas');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('certificate.pdf');
    });
  }

  public cambiar_password(): void{
    this.message = '';
    if(this.confirma_password==this.currentUser.password){
      this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe({
        next: (res) => {
          this.message = this.translateService.instant('EXAMENES.MENSAJE_EDICION');
          this.confirma_password = "";
        },
        error: (e) => console.error(e)
      });
    }
    else{
      this.message = this.translateService.instant(
        'USUARIOS.PASSWORD_NO_COINCIDE'
      );
    }
  }

  public doExam(title:string): void{
    this.currentUser = this.storageService.getUser();
    let tests = this.currentUser.tests;
    for (let index = 0; index < tests.length; index++) {
      const titleAux = tests[index].title;
      if(titleAux==title){
        tests[index].attemps = tests[index].attemps - 1;
      }
    }
    this.currentUser.tests = tests;
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe({
        next: (data2) => {
          this.storageService.saveUser(this.currentUser);
          //this.tablas.toArray().forEach(data => data.renderRows());
        },
        error: (e) => console.error(e),
      });

  }

}
