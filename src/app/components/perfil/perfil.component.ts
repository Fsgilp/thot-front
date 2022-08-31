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

  rating:number = 2.63;
  confirma_password="";
  message="";
  currentUser: any;
  datos: Tutorial[] = [];
  datos2: User[] = [];
  columnas: string[] = ["download",'test','language',"attemps","retry", 'passed',"vote"];
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
    const createElement = (str: string) => {
      const el = document.createElement("div");
      el.innerHTML = str;
      return el.firstElementChild;
    };

    let DATA = createElement(`<div id="certificate" style="width:800px; height:600px; padding:20px; text-align:center; border: 10px solid #787878">
    <div style="width:750px; height:550px; padding:20px; text-align:center; border: 5px solid #787878"> +
           <span style="font-size:50px; font-weight:bold">Certificate of Completion</span>
           <br><br>
           <span style="font-size:25px"><i>This is to certify that</i></span>
           <br><br>
           <span style="font-size:30px"><b>`+this.currentUser.name + " " + this.currentUser.surname +`</b></span><br/><br/>
           <span style="font-size:25px"><i>has completed the course</i></span> <br/><br/>
           <span style="font-size:30px">`+test.title+`</span> <br/><br/>
           <span style="font-size:20px">with score of <b>PASSED</b></span> <br/><br/><br/><br/>
    </div>
    </div>`);
    document.getElementById('cont-certificate')?.appendChild(DATA as HTMLElement);
    let DATA2: any = document.getElementById('cont-certificate');

    console.log(DATA2);
    html2canvas(DATA2).then((canvas) => {
      document.getElementById('cont-certificate')?.removeChild(DATA as HTMLElement);
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('l', 'mm', 'a5');
      let position = 17;
      PDF.addImage(FILEURI, 'PNG', 30, position, fileWidth, fileHeight);
      PDF.save('certificate_'+ new Date() +'.pdf');
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
      if(titleAux==title && !tests[index].pass){
        tests[index].attemps = tests[index].attemps - 1;
      }
    }
    this.currentUser.tests = tests;
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe({
        next: (data2) => {
          this.storageService.saveUser(this.currentUser);
          // ENCONTRAR ID DEL EXAMEN A REALIZAR
          this.tutorialService.getByTitle(title)
          .subscribe({
            next: (res) => {
              if(res.existe){
                // ENRUTAR PARA HACER EL EXAMEN
                this.router.navigate(['/dotest/'+res.id]);

              }else{
                alert(this.translateService.instant('EXAMENES.MENSAJE_EXAMEN_NO_DISPONIBLE'));
              }
            },
            error: (e) => console.error(e)
          });
        },
        error: (e) => console.error(e),
      });

  }

  public mensaje($event:any, test:any):void{
    let ratingElement = document.getElementById(test.title)?.className.match(/(\d+)/);
    let valor = ratingElement?ratingElement[0]:0;
    this.currentUser=this.storageService.getUser();
    for (let index = 0; index < this.currentUser.tests.length; index++) {
      const titleAux = this.currentUser.tests[index].title;
      if(titleAux==test.title){
        this.currentUser.tests?.splice(index,1);
        this.currentUser.tests?.push({
          title: test.title,
          attemps: test.attemps,
          language: test.language,
          rating: valor,
          vote: false,
          pass: true
        });
      }
    }
  }

  public vote(test:any):void{

    this.currentUser=this.storageService.getUser();
    let ratingElement = document.getElementById(test.title)?.className.match(/(\d+)/);
    let valor = ratingElement?ratingElement[0]:0;
    let valorNumber = Number(valor);

    console.log(test);
    this.userService.findByEmail(this.currentUser.email).subscribe({
      next: (data) => {
        this.currentUser = data[0];
        let tests = this.currentUser.tests?this.currentUser.tests:[];
        for (let index = 0; index < tests.length; index++) {
          const titleAux = tests[index].title;
          if(titleAux==test.title){
            console.log("ANTES");
            console.log(this.currentUser.tests);
            this.currentUser.tests?.splice(index,1);
            this.currentUser.tests?.push({
              title: test.title,
              attemps: test.attemps,
              language: test.language,
              rating: valorNumber,
              vote: true,
              pass: true
            });
          }
        }
        this.userService
          .update(this.currentUser.id, this.currentUser)
          .subscribe({
            next: (data2) => {
              this.storageService.saveUser(this.currentUser);
              // Guardar el voto del tutorial, calculando el average
              console.log(test.id);
              this.tutorialService.findByTitle(test.title)
              .subscribe({
                next: (res) => {
                    console.log(res[0]);
                    res[0].num_votes?.push(valorNumber);
                    let num_votes = res[0].num_votes?.length;
                    let sumatorio = 0;
                    if(num_votes && res[0].num_votes){
                      for (let index = 0; index < num_votes; index++) {
                        const element = res[0].num_votes[index];
                        sumatorio = sumatorio + element;
                      }
                      res[0].rating = sumatorio/num_votes;
                    }
                    this.tutorialService
                      .update(res[0].id, res[0])
                      .subscribe({
                        next: (res) => {
                          console.log(res);
                          window.location.reload();
                        },
                        error: (e) => console.error(e),
                      });
                },
                error: (e) => console.error(e)
              });
            },
            error: (e) => console.error(e),
          });
      },
      error: (e) => console.error(e),
    });
  }

}
