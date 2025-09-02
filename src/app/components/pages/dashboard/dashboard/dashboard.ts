import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../../../services/alert/user/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  ngOnInit(): void {
    this.getUploadedCount();
    this.getExcelCount();

  }

  constructor(private user: User,private cdr: ChangeDetectorRef) { }

  uploadedCount: any[] = [];
  excelCount: any={};

  getUploadedCount() {
    this.user.getUploadedName().subscribe({
      next: (res: any) => {
        this.uploadedCount = res;
         this.cdr.detectChanges();
      },
      error: () => {
        console.log("error loading uploaded file name");
      }
    });
  }

getExcelCount() {
  this.user.getCount().subscribe({
    next: (res: any) => {
      this.excelCount = res; // wrap inside array
       this.cdr.detectChanges();
    },
    error: () => {
      console.log("error loading uploaded file count");
    }
  });
}

}
