import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Scan } from '../../../services/alert/scan/scan';
import { Alert } from '../../../services/alert/alert';

@Component({
  selector: 'app-compare-excel',
  imports: [CommonModule],
  templateUrl: './compare-excel.html',
  styleUrl: './compare-excel.css'
})
export class CompareExcel {

  constructor(private scan: Scan,private cdRef: ChangeDetectorRef,private alertService: Alert) {}



      reloadPage() {
    window.location.reload();
  }

showUploadModal = false;
selectedFile1: File | null = null;
selectedFile2: File | null = null;



onFile1Selected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.selectedFile1 = input.files[0];
  }
}

onFile2Selected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.selectedFile2 = input.files[0];
  }
}

comparisonResult: any[] = [];
comparisonHeaders: string[] = [];

// apply() {
//   if (this.selectedFile1 && this.selectedFile2) {
//     this.scan.compareExcels(this.selectedFile1, this.selectedFile2).subscribe({
//       next: (response) => {
//         if (Array.isArray(response) && response.length > 0) {
//           this.comparisonResult = response;
//           this.comparisonHeaders = Object.keys(response[0]); // dynamically extract headers
//         } else {
//           this.comparisonResult = [];
//           this.comparisonHeaders = [];
//         }
//         this.showUploadModal = false;
//       },
//       error: (error) => {
//         console.error('Comparison error', error);
//          this.alertService.showAlert('File comparison failed',"error");
//       }
//     });
//   } else {
//      this.alertService.showAlert('Please select both files before uploading.',"error");
//   }
// }


apply() {
  if (this.selectedFile1 && this.selectedFile2) {
    this.scan.compareExcels(this.selectedFile1, this.selectedFile2).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.comparisonResult = response;
          this.comparisonHeaders = Object.keys(response[0]); 
        } else {
          this.comparisonResult = [];
          this.comparisonHeaders = [];
        }
        
        this.alertService.showAlert('Files compared successfully');  
        this.showUploadModal = false;  
        this.cdRef.detectChanges();  
      },
      error: (error) => {
        console.error('Comparison error', error);
        this.alertService.showAlert('File comparison failed', "error");
      }
    });
  } else {
     this.alertService.showAlert('Please select both files before uploading.', "error");
  }
}




clear() {
  this.selectedFile1 = null;
  this.selectedFile2 = null;
  this.showUploadModal = false;
}







}
