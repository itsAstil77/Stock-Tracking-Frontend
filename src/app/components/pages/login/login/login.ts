import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from '../../../services/alert/alert';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  loginObj: any = {

    "email": "",
    "password": ""
  };
  forgotPasswordForm: FormGroup;
  showForgotPassword: boolean = false;
  isSendingOTP: boolean = false;

  http = inject(HttpClient);
  router = inject(Router);

  constructor(private fb: FormBuilder, private alertService: Alert) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ✅ Handle Login
  onLogin() {
    this.http.post("http://localhost:5041/api/Auth/login", this.loginForm.value,)
      .subscribe({
        next: (res: any) => {
          if (res.message == "Login successful") {
            localStorage.setItem("userEmail", this.loginForm.value.email);
            localStorage.setItem("authType", "login");
            this.alertService.showAlert(res.message,"success");
            this.router.navigateByUrl('/dashboard');

          } else {
            this.alertService.showAlert("Invalid login credentials!", "error");
          }
        },
        error: (err) => {
          this.alertService.showAlert("Login failed! Check your email & password.", "error");
          console.error(err);
        }
      });
  }



  navigateToForgotPassword() {
    this.router.navigateByUrl("forgot-password");
  }

  //  Reset OTP
  onSendResetOTP() {
    if (this.forgotPasswordForm.invalid) {
      this.alertService.showAlert("Please enter a valid email.");
      return;
    }

    this.isSendingOTP = true;

    this.http.post("http://localhost:5041/api/auth/forgot-password", this.forgotPasswordForm.value)
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert("OTP sent! Please check your email.");
          localStorage.setItem("resetEmail", this.forgotPasswordForm.value.email);
          this.router.navigateByUrl("reset-password");
          this.isSendingOTP = false;
        },
        error: (err) => {
          this.alertService.showAlert("Failed to send OTP. Try again.", "error");
          console.error(err);
          this.isSendingOTP = false;
        }
      });
  }
  

  // login.component.ts
isPasswordVisible: boolean = false;

togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}


}
