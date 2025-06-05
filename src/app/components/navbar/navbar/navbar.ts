import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Alert } from '../../services/alert/alert';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar  implements OnInit  {

    constructor(private router: Router,   private alertService: Alert,private http:HttpClient,private fb: FormBuilder) {}



  passwordForm!: FormGroup;

  isSidebarCollapsed: boolean = true; // Default: Only icons are visible
  isAdminExpanded: boolean = false;
  isDropdownOpen = false;
  showUserDropdown: boolean = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleAdministration() {
    this.isAdminExpanded = !this.isAdminExpanded;
    this.setActive('administration');
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent immediate closing
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }

    loggedInUsername: string = '';
  
    // ngOnInit(): void {
    //   this.loggedInUsername = localStorage.getItem('userEmail') || 'Guest';

    //   this.passwordForm = this.fb.group({
    //     currentPassword: ['', Validators.required],
    //     newPassword: ['', [Validators.required, Validators.minLength(6)]],
    //     confirmNewPassword: ['', Validators.required]
    //   });


    //   const userId = localStorage.getItem("userId");
    //   console.log("User ID from localStorage in update-password:", userId);
    
    //   if (!userId) {
    //     this.alertService.showAlert("User ID not found. Please log in again.", "error");
    //     this.router.navigateByUrl("login");
    //   }
    // }

    ngOnInit(): void {
  this.loggedInUsername = localStorage.getItem('userEmail') || 'Guest';

  this.passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  });

  const userId = localStorage.getItem("userId");
  if (!userId) {
    this.alertService.showAlert("User ID not found. Please log in again.", "error");
    this.router.navigateByUrl("login");
  }

  // ✅ Set active menu item based on current route
  const currentUrl = this.router.url;
  if (currentUrl.includes('dashboard')) {
    this.activeMenuItem = 'dashboard';
  } else if (currentUrl.includes('scan-creator')) {
    this.activeMenuItem = 'scan-creator';
  } else if (currentUrl.includes('compare-excel')) {
    this.activeMenuItem = 'compare-excel';
  } else if (currentUrl.includes('user-management')) {
    this.activeMenuItem = 'administration';
   
  }
}




    toggleUserDropdown(): void {
      this.showUserDropdown = !this.showUserDropdown;
    }
  
    hideUserDropdown(): void {
      // small delay to let click handlers run before closing
      setTimeout(() => this.showUserDropdown = false, 200);
    }
  
    logout(): void {
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
  
    goToProfile(): void {
      this.router.navigateByUrl('/my-profile');
    }
  

  
    support(): void {
      this.router.navigateByUrl('/support');
    }


    isUpdate:boolean=false;

    changePassword(){
      this.isUpdate=true;

    }
    closePopup(){
      this.isUpdate=false;
    }
    updatePassword() {
      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId); // ✅ This confirms user ID is retrieved
    
      if (!userId) {
        this.alertService.showAlert("User ID not found. Please log in again.");
        return;
      }
    
      const payload = {
        userId: userId, // This is the correct value
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmNewPassword: this.passwordForm.value.confirmNewPassword
      };
    
      console.log("Password update payload:", payload); // ✅ Log the payload
    
      // Change HTTP request method to PUT
      this.http.put("http://172.16.100.66:5221/api/user/change-password", payload)
        .subscribe({
          next: (res: any) => {
            console.log("Password change response:", res); // ✅ Log the response
            this.alertService.showAlert(res.message || "Password changed successfully.");
            this.router.navigateByUrl("login");
          },
          error: (err) => {
            console.error("Password change error:", err); // ✅ Log the error
            this.alertService.showAlert("Failed to change password.");
          }
        });
    }
    

    closeAdminPanel() {
      this.isAdminExpanded = false;
    }
    
    activeMenuItem: string = 'dashboard'; // default active is dashboard

setActive(menuItem: string): void {
  this.activeMenuItem = menuItem; // only one active at a time
}

}
