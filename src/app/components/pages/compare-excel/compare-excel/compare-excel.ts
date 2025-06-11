import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Scan } from '../../../services/alert/scan/scan';
import { Alert } from '../../../services/alert/alert';
import { FormsModule } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-compare-excel',
  imports: [CommonModule,FormsModule],
  templateUrl: './compare-excel.html',
  styleUrl: './compare-excel.css'
})
export class CompareExcel {

  constructor(private scan: Scan,private cdRef: ChangeDetectorRef,private alertService: Alert) {}

      reloadPage() {
    window.location.reload();
  }


@ViewChild('fileInput1') fileInput1Ref!: ElementRef<HTMLInputElement>;
@ViewChild('fileInput2') fileInput2Ref!: ElementRef<HTMLInputElement>;

// showUploadModal = false;
// selectedFile1: File | null = null;
// selectedFile2: File | null = null;



// onFile1Selected(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (input.files?.length) {
//     this.selectedFile1 = input.files[0];
//   }
// }

// onFile2Selected(event: Event) {
//   const input = event.target as HTMLInputElement;
//   if (input.files?.length) {
//     this.selectedFile2 = input.files[0];
//   }
// }

comparisonResult: any[] = [];
comparisonHeaders: string[] = [];



// apply() {

//   if (this.selectedFile1 && this.selectedFile2) {
//     this.scan.compareExcels(this.selectedFile1, this.selectedFile2).subscribe({
//       next: (response) => {
//         if (Array.isArray(response) && response.length > 0) {
//           this.comparisonResult = response;
//           this.comparisonHeaders = Object.keys(response[0]); 
//         } else {
//           this.comparisonResult = [];
//           this.comparisonHeaders = [];
//         }
        
//         this.alertService.showAlert('Files compared successfully');  
//         this.showUploadModal = false;  
//         this.cdRef.detectChanges();  
//       },
//       error: (error) => {
//         console.error('Comparison error', error);
//         this.alertService.showAlert('File comparison failed', "error");
//       }
//     });
//   } else {
//      this.alertService.showAlert('Please select both files before uploading.', "error");
//   }
// }




// clear() {
//   this.selectedFile1 = null;
//   this.selectedFile2 = null;
//   this.showUploadModal = false;
// }



showOnlineModal = false;

startDate: string = '';
endDate: string = '';

openImportOnline() {

  this.showOnlineModal = true;
  this.startDate="",
  this.endDate=""

  this.file1Data = [];
  this.file2Data = [];
  this.comparisonResult = [];
  this.comparisonHeaders = [];
  this.file1Raw = null;
  this.file2Raw = null;
  this.showData = null;

  this.cdRef.detectChanges();
}

closeOnline() {
  this.showOnlineModal = false;
}

 download() {
    if (!this.startDate || !this.endDate) {
      this.alertService.showAlert('Please select start and end dates',"error");
      return;
    }

    this.scan.exportExcel(this.startDate, this.endDate).subscribe({
      next: (blob) => {
        const fileName = `Report-${this.startDate}-to-${this.endDate}.xlsx`;
        saveAs(blob, fileName);
         this.alertService.showAlert('File downloaded successfully',"success");
         this.showOnlineModal = false;
        //  this.showUploadModal = true;
         this.cdRef.detectChanges(); 
      },
      error: (err) => {
        console.error('Download failed', err);
        this.alertService.showAlert('Failed to download Excel file',"error");
      }
    });
  }
file1Data: any[][] = [];
file2Data: any[][] = [];

showData: 'file1' | 'file2' | 'compare' | null = null;

  private file1Raw: File | null = null;
  private file2Raw: File | null = null;

  onFiles1Selected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.file1Raw = file;
    this.viewFile1();
  }

  onFiles2Selected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.file2Raw = file;
    this.viewFile2();
  }

  viewFile1() {
    if (!this.file1Raw) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      this.file1Data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      this.showData = 'file1';
       this.cdRef.detectChanges();
    };
    reader.readAsArrayBuffer(this.file1Raw);
  }

  viewFile2() {
    if (!this.file2Raw) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      this.file2Data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      this.showData = 'file2';
       this.cdRef.detectChanges();
    };
    reader.readAsArrayBuffer(this.file2Raw);
  }

applyy() {
  if (this.file1Raw && this.file2Raw) {
    this.scan.compareExcels(this.file1Raw, this.file2Raw).subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.comparisonResult = response;
          this.comparisonHeaders = Object.keys(response[0]);
          this.showData = 'compare'; // Show comparison by default
        } else {
          this.comparisonResult = [];
          this.comparisonHeaders = [];
          this.showData = null;
        }

        this.alertService.showAlert('Files compared successfully');
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Comparison error', error);
        this.alertService.showAlert('File comparison failed', 'error');
      }
    });
  } else {
    this.alertService.showAlert('Please select both files before comparing.', 'error');
  }
}


importOnline() {
  // Clear all data
  this.file1Data = [];
  this.file2Data = [];
  this.comparisonResult = [];
  this.comparisonHeaders = [];
  this.file1Raw = null;
  this.file2Raw = null;
  this.showData = null;

  this.cdRef.detectChanges();

  }



}




