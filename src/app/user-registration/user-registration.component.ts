import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-registration.component.html',
})
export class UserRegistrationComponent {
  userForm: FormGroup;
  submitAttempted = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      engineerName: ['', Validators.required],
      qualification: ['', Validators.required],
      jobTitle: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      contractNumber: ['', Validators.required],
      visualID: ['', Validators.required],
      cvFile: [null],
      nationality: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onSubmit() {
    this.submitAttempted = true;

    // Mark all fields as touched to trigger validation display
    this.markFormGroupTouched(this.userForm);

    // Check form validity
    if (this.userForm.valid) {
      // Form is valid, proceed with submission
      console.log('Form Submitted', this.userForm.value);
      
      // Here you would typically send the form data to a backend service
      // For example:
      // this.userService.registerUser(this.userForm.value).subscribe(
      //   response => {
      //     // Handle successful registration
      //     console.log('Registration successful', response);
      //   },
      //   error => {
      //     // Handle registration error
      //     console.error('Registration failed', error);
      //   }
      // );
    } else {
      // Form is invalid
      console.error('Form is invalid', this.userForm.errors);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.patchValue({
        cvFile: file
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control ? 
      (control.invalid && (control.dirty || control.touched || this.submitAttempted)) : 
      false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);
    if (!control) return '';

    if (control.errors) {
      if (control.errors['required']) return 'هذا الحقل مطلوب';
      if (control.errors['email']) return 'البريد الإلكتروني غير صحيح';
      if (control.errors['pattern']) return 'القيمة غير صحيحة';
      if (control.errors['minLength']) return 'الطول غير كافٍ';
      if (control.errors['passwordMismatch']) return 'كلمة المرور غير متطابقة';
    }
    return '';
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    
    return null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}