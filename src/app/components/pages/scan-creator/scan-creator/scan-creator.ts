import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Scan } from '../../../services/alert/scan/scan';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { Alert } from '../../../services/alert/alert';
// import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scan-creator',
  imports: [CommonModule,FormsModule,QRCodeComponent],
  templateUrl: './scan-creator.html',
  styleUrl: './scan-creator.css'
})
export class ScanCreator {


  constructor(private scan: Scan,private cdRef: ChangeDetectorRef, private alertService: Alert) {}

    reloadPage() {
    window.location.reload();
  }


showUploadModal = false;
selectedFile: File | null = null;
excelData: any[][] = [];  

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    this.selectedFile = input.files[0];

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const arrayBuffer = fileReader.result;
      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      this.excelData = jsonData;
      console.log('Parsed Excel data:', this.excelData);
    };

    fileReader.readAsArrayBuffer(this.selectedFile);
  }
}


uploadedExcelData: any[] = [];

apply() {
  if (this.selectedFile) {
    const fileName = this.selectedFile.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    if (fileExtension !== 'xlsx') {
      this.alertService.showAlert('Invalid file format. Only .xlsx files are allowed.',"error");
      return;
    }

    this.scan.uploadExcel(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload successful', response);
    this.alertService.showAlert('File uploaded successfully',"success");
        this.showUploadModal = false;
        this.selectedFile = null;
         this.cdRef.detectChanges();

        // Assuming response contains JSON array of objects or array of arrays
        this.uploadedExcelData = response.data; // adjust as per your backend response structure
      },
      error: (error) => {
        console.error('Upload error', error);
        this.alertService.showAlert('File upload failed',"error");
      }
    });
  } else {
    this.alertService.showAlert('Please select a file first.',"error");
  }
}


clear() {
    this.selectedFile = null;
    this.showUploadModal = false;
    this.cdRef.detectChanges();
  }

  open(){

     this.showUploadModal = true;
  }


  selectedRows: boolean[] = [];

toggleAllCheckboxes(event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  this.selectedRows = this.excelData.slice(1).map(() => checked);
}





qrCodes: string[] = [];
showQRModal = false; // Controls modal visibility


// generateQRCodes() {
//   this.qrCodes = [];

//   // Ensure excelData and selectedRows are ready
//   if (!this.excelData || this.excelData.length < 2) {
//     this.alertService.showAlert('No data to generate QR codes.',"error");
//     return;
//   }

//   const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);

//   if (selectedData.length === 0) {
//     this.alertService.showAlert('Please select at least one row to generate QR codes.',"error");
//     return;
//   }

//   selectedData.forEach((row) => {
//     const rowData: { [key: string]: any } = {};

//     // Map header to values
//     this.excelData[0].forEach((header, i) => {
//       rowData[header] = row[i];
//     });

//     // Format QR code content as JSON string (or customize here)
//     const qrContent = JSON.stringify(rowData);
//     this.qrCodes.push(qrContent);
//   });

//   this.showQRModal = true;
// }



generateQRCodes() {
  this.qrCodes = [];

  // Ensure excelData and selectedRows are ready
  if (!this.excelData || this.excelData.length < 2) {
    this.alertService.showAlert('No data to generate QR codes.', "error");
    return;
  }

  const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);

  if (selectedData.length === 0) {
    this.alertService.showAlert('Please select at least one row to generate QR codes.', "error");
    return;
  }

  // Find the index of the "Barcode" header
  const barcodeHeaderIndex = this.excelData[0].findIndex(header => 
    header.toLowerCase() === 'barcode'
  );

  if (barcodeHeaderIndex === -1) {
    this.alertService.showAlert('No "Barcode" column found in the data.', "error");
    return;
  }

  selectedData.forEach((row) => {
    // Get just the barcode value from the row
    const barcodeValue = row[barcodeHeaderIndex];
    
    // Use the barcode value directly as QR content
    this.qrCodes.push(barcodeValue);
  });

  this.showQRModal = true;
}

}
