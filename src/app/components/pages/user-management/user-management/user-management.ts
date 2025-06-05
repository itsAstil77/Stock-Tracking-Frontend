import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../../services/alert/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Alert } from '../../../services/alert/alert';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule,FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {

    reloadPage() {
    window.location.reload();
  }

    users: any[] = [];

  constructor(private userService: User, private alertService: Alert,private cdRef: ChangeDetectorRef) {}

ngOnInit(): void {

  this.fetchUsers();
  
}



fetchUsers(): void {
  this.userService.getAllUsers().subscribe({
    next: (data) => {
      this.users = data;
      console.log('Users:', data);
      this.cdRef.detectChanges(); // ✅ Force UI update
    },
    error: (err) => {
      console.error('Failed to fetch users:', err);
    }
  });
}



  user = {
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

isPasswordVisible = false;
isConfirmPasswordVisible = false;
isAddUserPopupOpen = false;



  createUser() {
  this.userService.createUser(this.user).subscribe({
    next: (res) => {
      this.alertService.showAlert(res.message,"success");        
      this.closeAddUserPopup();          
      this.fetchUsers();             
    },
    error: (err) => {
      console.error('Error creating user:', err);
      const errorMsg = err?.error?.message || 'User creation failed';
      this.alertService.showAlert(errorMsg,"error");              
    }
  });
}

resetUserForm() {
  this.user = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
}


openAddUserPopup(): void {
  this.isAddUserPopupOpen = true;
  this.resetUserForm();
}

closeAddUserPopup() {
  this.isAddUserPopupOpen = false;
  this.resetUserForm();
  this.cdRef.detectChanges();
}

closeUpdateUserPopup() {
  this.isUpdateUserPopupOpen = false;
  this.selectedUserId = null;
  this.resetUserForm();
  this.cdRef.detectChanges();
}



 isUpdateUserPopupOpen = false;
selectedUserId: string | null = null;

openUpdateUserPopup(userData: any): void {
    this.isUpdateUserPopupOpen = true;
    this.selectedUserId = userData.id;
    this.user = {
      userName: userData.userName || '',
      email: userData.email || '',
      password: '',
      confirmPassword: ''
    };
  }

  updateUser() {
    if (!this.selectedUserId) return;

    this.userService.updateUser(this.selectedUserId, this.user).subscribe({
      next: (res) => {
        this.alertService.showAlert(res.message);
        this.closeUpdateUserPopup();
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        const errorMsg = err?.error?.message || 'User update failed';
        this.alertService.showAlert(errorMsg,"error");
      }
    });
  }

  isDeletePopupOpen = false;
  userIdToDelete: string | null = null;


  openDeletePopup(userId: string): void {
    this.isDeletePopupOpen = true;
    this.userIdToDelete = userId;
  }

  closeDeletePopup(): void {
    this.isDeletePopupOpen = false;
    this.userIdToDelete = null;
    this.cdRef.detectChanges();
  }



  confirmDelete(): void {
    if (this.userIdToDelete) {
      this.userService.deleteUser(this.userIdToDelete).subscribe({
        next: (res) => {
          this.alertService.showAlert(res.message);
          this.fetchUsers();
          this.closeDeletePopup();
        },
        error: (err) => {
          this.alertService.showAlert('Failed to delete user',"error");
        }
      });
    }
  }

}
