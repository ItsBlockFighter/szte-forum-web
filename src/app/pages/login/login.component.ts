import {Component, inject} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router, RouterLink} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";
import {FirebaseError} from '@angular/fire/app';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, RouterLink, NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private auth: AuthService = inject(AuthService);

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private _snackBar: MatSnackBar, private router: Router) {
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  async login() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email;
    const password = this.form.value.password;

    try {
      await this.auth.login(email, password);
      this._snackBar.open('Sikeres bejelentkezés', 'Bezárás', {
        duration: 2000,
      });
      await this.router.navigate(['/']);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            this._snackBar.open('A fiók nem található!', 'Bezárás', {
              duration: 2000,
            });
            return;
          case 'auth/wrong-password':
            this._snackBar.open('Hibás jelszó!', 'Bezárás', {
              duration: 2000,
            });
            return;
          case 'auth/too-many-requests':
            this._snackBar.open('Túl sok kérés!', 'Bezárás', {
              duration: 2000,
            });
            return;
          case 'auth/invalid-credential':
            this._snackBar.open('Hibás adatok!', 'Bezárás', {
              duration: 2000,
            });
            return;
          default:
            this._snackBar.open(error.message, 'Bezárás', {
              duration: 2000,
            });
            return;
        }
      }
      this._snackBar.open('Hiba történt!', 'Bezárás', {
        duration: 2000,
      });
    }
  }
}
