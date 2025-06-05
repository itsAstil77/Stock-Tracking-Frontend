// import { ChangeDetectorRef, Component } from '@angular/core';
// import { Alert } from '../../../services/alert/alert';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-custom-alert',
//   imports: [CommonModule],
//   templateUrl: './custom-alert.html',
//   styleUrl: './custom-alert.css'
// })
// export class CustomAlert {

//     show = false;
//   message = '';
//   alertType: 'success' | 'error' | 'warning' = 'success';


// constructor(
//     private alertService: Alert,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.alertService.alert$.subscribe(({ message, type }) => {
//       this.message = message;
//       this.alertType = type;
//       this.show = true;


//       this.cdr.detectChanges();

//       if (type === 'success') {
//         setTimeout(() => this.close(), 2000);
//       }
//     });
//   }

//   close() {
//     this.show = false;
//   }



// }


import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { Alert } from '../../../services/alert/alert';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-alert.html',
  styleUrls: ['./custom-alert.css']
})
export class CustomAlert {
  show = false;
  message = '';
  alertType: 'success' | 'error' | 'warning' = 'success';
  private autoCloseTimeout: any;

  constructor(
    private alertService: Alert,
    private cdr: ChangeDetectorRef
  ) {
    this.alertService.alert$.subscribe(({ message, type }) => {
      this.message = message;
      this.alertType = type;
      this.show = true;
      this.cdr.detectChanges();

      // Clear any existing timeout
      if (this.autoCloseTimeout) {
        clearTimeout(this.autoCloseTimeout);
      }

      // Auto-close only for success alerts
      if (type === 'success') {
        this.autoCloseTimeout = setTimeout(() => this.close(), 2000);
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const alertBox = (event.target as HTMLElement).closest('.alert-box');
    if (!alertBox && this.show && this.alertType !== 'success') {
      this.close();
    }
  }

  close() {
    this.show = false;
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
    }
    this.cdr.detectChanges();
  }
}
