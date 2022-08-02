import { StorageService } from 'src/app/services/storage.service';
import { MatTable } from '@angular/material/table';
import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { UserService } from 'src/app/services/user.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  currentUser: any;
  datos: Tutorial[] = [];
  datos2: User[] = [];
  columnas: string[] = ['test','passed',"attemps","retry","download"];
  columnas2: string[] = ['nombre','email',"test","passed","attemps","download"];

  @ViewChildren(MatTable) tablas!: QueryList<any>;
  @ViewChild('testTable1') tests!: MatTable<Tutorial>;
  @ViewChild('testTable2') users!: MatTable<User>;

  constructor(private storageService: StorageService, private userService: UserService) {}

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

}
