import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Scan } from '../../../services/alert/scan/scan';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { Alert } from '../../../services/alert/alert';


@Component({
  selector: 'app-scan-creator',
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './scan-creator.html',
  styleUrl: './scan-creator.css'
})
export class ScanCreator {


  constructor(private scan: Scan, private cdRef: ChangeDetectorRef, private alertService: Alert) { }

  reloadPage() {
    window.location.reload();
  }


  showUploadModal = false;
  selectedFile: File | null = null;
  excelData: any[][] = [];

  uploadedFileName: string | null = null;


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadedFileName = this.selectedFile.name;   // <-- store file name

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
        this.alertService.showAlert('Invalid file format. Only .xlsx files are allowed.', "error");
        return;
      }

      this.scan.uploadExcel(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.alertService.showAlert('File uploaded successfully', "success");
          this.showUploadModal = false;
          this.selectedFile = null;
          this.cdRef.detectChanges();

          // Assuming response contains JSON array of objects or array of arrays
          this.uploadedExcelData = response.data; // adjust as per your backend response structure
        },
        error: (error) => {
          console.error('Upload error', error);
          this.alertService.showAlert('File upload failed', "error");
        }
      });
    } else {
      this.alertService.showAlert('Please select a file first.', "error");
    }
  }


  clear() {
    this.selectedFile = null;
    this.uploadedFileName = null;
    this.showUploadModal = false;
    this.cdRef.detectChanges();
  }

  open() {

    this.showUploadModal = true;
    this.isOpenUploadExcel = false;
  }


  selectedRows: boolean[] = [];

  toggleAllCheckboxes(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedRows = this.excelData.slice(1).map(() => checked);
  }



  showQRModal = false; // Controls modal visibility




  qrCodes: { materialCode: string, description: string }[] = [];

  // generateQRCodes() {
  //   console.log("Worked")
  //   this.qrCodes = [];

  //   if (!this.excelData || this.excelData.length < 2) {
  //     this.alertService.showAlert('No data to generate QR codes.', "error");
  //     return;
  //   }

  //   const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);

  //   if (selectedData.length === 0) {
  //     this.alertService.showAlert('Please select at least one row to generate QR codes.');
  //     return;
  //   }

  //   // Find indexes of "Barcode" and "Description"
  //   const headers = this.excelData[0].map(h => h.toLowerCase());
  //   const materialCodeIndex = headers.findIndex(h => h === 'materialCode');
  //   const descIndex = headers.findIndex(h => h === 'description');

  //   if (materialCodeIndex === -1) {
  //     this.alertService.showAlert('No "Barcode" column found in the data.', "error");
  //     return;
  //   }

  //   selectedData.forEach(row => {
  //     const materialCode = row[materialCodeIndex];
  //     const description = descIndex !== -1 ? row[descIndex] : 'No description';

  //     this.qrCodes.push({ materialCode, description });
  //   });

  //   this.showQRModal = true;
  // }

  generateQRCodes() {
    console.log("Generate QR Codes clicked");
    this.qrCodes = [];

    if (!this.excelData || this.excelData.length < 2) {
      this.alertService.showAlert('No data available to generate QR codes.', "error");
      return;
    }

    // Extract headers
    const headers = this.excelData[0].map(h => (h + '').toLowerCase().trim());

    // Flexible matching for columns
    const materialCodeIndex = headers.findIndex(h =>
      h === 'material code' || h === 'barcode' || h === 'material code'
    );

    const descIndex = headers.findIndex(h =>
      h === 'material description' || h === 'description' || h === 'desc' || h === 'details'
    );

    if (materialCodeIndex === -1) {
      this.alertService.showAlert('No "MaterialCode / Barcode" column found in the data.', "error");
      return;
    }

    // Selected rows only
    const selectedData = this.excelData.slice(1).filter((_, index) => this.selectedRows[index]);

    if (selectedData.length === 0) {
      this.alertService.showAlert('Please select at least one row to generate QR codes.', "error");
      return;
    }

    // Build QR list
    selectedData.forEach(row => {
      const materialCode = row[materialCodeIndex] ? String(row[materialCodeIndex]) : 'N/A';
      const description = descIndex !== -1 && row[descIndex] ? String(row[descIndex]) : 'No description';

      this.qrCodes.push({ materialCode, description });
    });

    console.log("QR Codes generated:", this.qrCodes);
    this.showQRModal = true;
  }






  // printLabels() {
  //   const printArea = document.getElementById('print-area');

  //   if (!printArea) {
  //     this.alertService.showAlert("No QR code area found.", "error");
  //     return;
  //   }

  //   // Make sure print area is visible
  //   printArea.style.display = 'block';

  //   // Give Angular time to render QR as <img>
  //   setTimeout(() => {
  //     // Create a hidden iframe instead of a new window
  //     const iframe = document.createElement('iframe');
  //     iframe.style.position = 'absolute';
  //     iframe.style.width = '1px';
  //     iframe.style.height = '1px';
  //     iframe.style.left = '-9999px';
  //     iframe.style.top = '-9999px';
  //     document.body.appendChild(iframe);

  //     const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

  //     if (!iframeDoc) {
  //       this.alertService.showAlert("Failed to create print iframe.", "error");
  //       return;
  //     }

  //     iframeDoc.open();
  //     iframeDoc.write(`
  //     <html>
  //       <head>
  //         <title>Print Labels</title>
  //         <style>
  //           @page {
  //             margin: 0;
  //             size: auto;
  //           }
  //           body {
  //             margin: 0;
  //             padding: 0;
  //           }
  //           .print-label {
  //             width: 50mm;
  //             height: 25mm;
  //             page-break-after: always;
  //             text-align: center;
  //             padding: 4mm;
  //             box-sizing: border-box;
  //           }
  //           .print-label img {
  //             display: block;
  //             margin: 0 auto 3mm;
  //             max-width: 100%;
  //             max-height: 100%;
  //           }
  //           .print-label p {
  //            white-space: nowrap;
  //            overflow: visible;
  //            text-overflow: ellipsis;
  //            margin: 0;
  //            font-size: 74px; /* adjust to fit */
  //          }
  //         </style>
  //       </head>
  //       <body>
  //         ${printArea.innerHTML}
  //       </body>
  //     </html>
  //   `);
  //     iframeDoc.close();

  //     // Wait for iframe to load before printing
  //     iframe.onload = () => {
  //       setTimeout(() => {
  //         const iframeWindow = iframe.contentWindow;
  //         if (iframeWindow) {
  //           iframeWindow.focus();
  //           iframeWindow.print();
  //         }

  //         // Clean up
  //         document.body.removeChild(iframe);
  //         printArea.style.display = 'none';
  //       }, 100);
  //     };
  //   }, 500);
  // }


  printLabels() {
    const printArea = document.getElementById('print-area');

    if (!printArea) {
      this.alertService.showAlert("No QR code area found.", "error");
      return;
    }

    printArea.style.display = 'block';

    setTimeout(() => {
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
              font-family: Arial, sans-serif;
            }
            .print-label {
              width: 50mm;
              height: 25mm;
             display: flex;
             align-items: flex-start;   /* align QR + text to top */
             justify-content: flex-start; /* push all to left */
             padding: 2mm ;   /* minimal padding, left almost 0 */
              box-sizing: border-box;
              page-break-after: always;
            }
            .print-label img {
              width: 21mm;
              height: 21mm;
              margin-right: 0mm;          /* gap between QR and text */
            }
            .text-content {
              display: flex;
              flex-direction: column;
              text-align: left;           /* text aligned left */
              margin-top:2mm; 
               line-height: 0.0;
     
            }
 .text-content .code {
  font-weight: bold;   
  font-size: 3mm;
}

.text-content .desc {
  margin: 0mm;
  font-size: 3mm;
   line-height: 1.0;
}
          </style>
        </head>
        <body>
          ${printArea.innerHTML}
        </body>
      </html>
    `);
      iframeDoc.close();

      iframe.onload = () => {
        setTimeout(() => {
          const iframeWindow = iframe.contentWindow;
          if (iframeWindow) {
            iframeWindow.focus();
            iframeWindow.print();
          }
          document.body.removeChild(iframe);
          printArea.style.display = 'none';
        }, 100);
      };
    }, 500);
  }




  isOpenUploadExcel = false;


  openExcelPopup(): void {
    this.isOpenUploadExcel = true;

  }

  closeExcelPopup(): void {
    this.isOpenUploadExcel = false;
  }






}
