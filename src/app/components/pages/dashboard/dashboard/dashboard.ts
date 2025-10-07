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
     this.getHighestDifference();
    this.getLowestDifference();
    this.getDifferenceOutOf();

  }

  constructor(private user: User,private cdr: ChangeDetectorRef) { }

  uploadedCount: any[] = [];
  excelCount: any={};
   highestDifferences: any[] = [];
  lowestDifferences: any[] = [];
  mismatchSummary: any = {}; 


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

 getHighestDifference() {
    this.user.gethighestdifference().subscribe({
      next: (res: any) => {
        this.highestDifferences = res;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log("Error loading highest differences");
      }
    });
  }

  // ✅ Get top 10 smallest differences
  getLowestDifference() {
    this.user.getlowestdifference().subscribe({
      next: (res: any) => {
        this.lowestDifferences = res;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log("Error loading lowest differences");
      }
    });
  }
mismatchFraction: string = '';   // to store "77 / 100"

getDifferenceOutOf() {
  this.user.getdifferenceoutof().subscribe({
    next: (res: any) => {
      this.mismatchSummary = res;

      // Assuming API returns { mismatchedItems: 77, totalItems: 100 }
      this.mismatchFraction = `${res.mismatchedItems} / ${res.totalItems}`;

      this.cdr.detectChanges();
      console.log("Mismatch summary loaded:", this.mismatchFraction);
    },
    error: () => {
      console.log("Error loading mismatch summary");
    }
  });
}


  

}
