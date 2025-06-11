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





// qrCodes: string[] = [];
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



// generateQRCodes() {
//   this.qrCodes = [];

//   // Ensure excelData and selectedRows are ready
//   if (!this.excelData || this.excelData.length < 2) {
//     this.alertService.showAlert('No data to generate QR codes.', "error");
//     return;
//   }

//   const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);
  

//   if (selectedData.length === 0) {
//     this.alertService.showAlert('Please select at least one row to generate QR codes.', "error");
//     return;
//   }

//   // Find the index of the "Barcode" header
//   const barcodeHeaderIndex = this.excelData[0].findIndex(header => 
//     header.toLowerCase() === 'barcode'
//   );

//   if (barcodeHeaderIndex === -1) {
//     this.alertService.showAlert('No "Barcode" column found in the data.', "error");
//     return;
//   }

//   selectedData.forEach((row) => {
//     // Get just the barcode value from the row
//     const barcodeValue = row[barcodeHeaderIndex];
    
//     // Use the barcode value directly as QR content
//     this.qrCodes.push(barcodeValue);
//   });

//   this.showQRModal = true;
// }



qrCodes: { barcode: string, description: string }[] = [];

generateQRCodes() {
  this.qrCodes = [];

  if (!this.excelData || this.excelData.length < 2) {
    this.alertService.showAlert('No data to generate QR codes.', "error");
    return;
  }

  const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);

  if (selectedData.length === 0) {
    this.alertService.showAlert('Please select at least one row to generate QR codes.', "error");
    return;
  }

  // Find indexes of "Barcode" and "Description"
  const headers = this.excelData[0].map(h => h.toLowerCase());
  const barcodeIndex = headers.findIndex(h => h === 'barcode');
  const descIndex = headers.findIndex(h => h === 'description');

  if (barcodeIndex === -1) {
    this.alertService.showAlert('No "Barcode" column found in the data.', "error");
    return;
  }

  selectedData.forEach(row => {
    const barcode = row[barcodeIndex];
    const description = descIndex !== -1 ? row[descIndex] : 'No description';
    
    this.qrCodes.push({ barcode, description });
  });

  this.showQRModal = true;
}





// printLabels() {
//   const printArea = document.getElementById('print-area');

//   if (!printArea) {
//     this.alertService.showAlert("No QR code area found.", "error");
//     return;
//   }

//   // Make sure print area is visible
//    printArea.style.display = 'block';

//   // Give Angular time to render QR as <img>
//   setTimeout(() => {
//     const printWindow = window.open('', '', 'width=800,height=600');
//     if (!printWindow) {
//       this.alertService.showAlert("Failed to open print window.", "error");
//       return;
//     }

//     printWindow.document.write(`
//       <html>
//         <head>
//           <style>
//             @media print {
//               .print-label {
//                 width: 50mm;
//                 height: 25mm;
//                 page-break-after: always;
//                 text-align: center;
//                 padding: 4mm;
//                 box-sizing: border-box;
//               }
//               .print-label img {
//                 display: block;
//                 margin: 0 auto 3mm;
//                 max-width: 100%;
//                 max-height: 100%;
//               }
//               body {
//                 margin: 0;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           ${printArea.innerHTML}
//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();

//     printArea.style.display = 'none'; // hide again after printing
//   }, 500);
// }




printLabels() {
  const printArea = document.getElementById('print-area');

  if (!printArea) {
    this.alertService.showAlert("No QR code area found.", "error");
    return;
  }

  // Make sure print area is visible
  printArea.style.display = 'block';

  // Give Angular time to render QR as <img>
  setTimeout(() => {
    // Create a hidden iframe instead of a new window
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) {
      this.alertService.showAlert("Failed to create print iframe.", "error");
      return;
    }

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Print Labels</title>
          <style>
            @page {
              margin: 0;
              size: auto;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-label {
              width: 50mm;
              height: 25mm;
              page-break-after: always;
              text-align: center;
              padding: 4mm;
              box-sizing: border-box;
            }
            .print-label img {
              display: block;
              margin: 0 auto 3mm;
              max-width: 100%;
              max-height: 100%;
            }
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for iframe to load before printing
    iframe.onload = () => {
      setTimeout(() => {
        const iframeWindow = iframe.contentWindow;
        if (iframeWindow) {
          iframeWindow.focus();
          iframeWindow.print();
        }
        
        // Clean up
        document.body.removeChild(iframe);
        printArea.style.display = 'none';
      }, 100);
    };
  }, 500);
}


}
