import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth.service';
import {FirebaseError} from "@angular/fire/app";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
    MatError,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService: AuthService = inject(AuthService);

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private router: Router) {
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  async register() {
    try {
      if (this.form.invalid) {
        return;
      }

      const username = this.form.value.username;
      const email = this.form.value.email;
      const password = this.form.value.password;

      await this.authService.register(username, email, password);

      this._snackBar.open('Sikeres regisztráció!', 'Bezárás', {
        duration: 2000,
      });

      try {
        await this.authService.login(email, password);
        await this.router.navigate(['/']);
      } catch (error) {
        this._snackBar.open('Hiba történt!', 'Bezárás', {
          duration: 2000,
        });
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            this._snackBar.open('Email már használatban van!', 'Bezárás', {
              duration: 2000,
            });
            return;
          case 'auth/invalid-email':
            this._snackBar.open('Érvénytelen e-mail!', 'Bezárás', {
              duration: 2000,
            });
            return;
          case 'auth/weak-password':
            this._snackBar.open('Gyenge jelszó!', 'Bezárás', {
              duration: 2000,
            });
            return;
          default:
            console.error(error);
            this._snackBar.open('Hiba történt!', 'Bezárás', {
              duration: 2000,
            });
            return;
        }
      }
      this._snackBar.open(`${error}`, 'Bezárás', {
        duration: 2000,
      });
    }
  }
}
