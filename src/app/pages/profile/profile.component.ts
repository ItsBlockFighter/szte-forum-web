import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {UserAvatarComponent} from "../../components/user-avatar/user-avatar.component";
import {LoadingComponent} from "../../components/loading/loading.component";
import {Router} from "@angular/router";
import {AvatarService} from '../../services/avatar.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatButton,
    UserAvatarComponent,
    LoadingComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {

  private authService: AuthService = inject(AuthService);
  private avatarService: AvatarService = inject(AvatarService);

  @ViewChild('avatarInput')
  avatarInput: ElementRef | null = null;

  @ViewChild('avatar')
  avatar: UserAvatarComponent | null = null;

  user: User | null = null;

  constructor(private router: Router, private _snackBar: MatSnackBar) {
  }

  async ngOnInit() {
    this.user = await this.authService.currentUser;
  }

  ngOnDestroy() {
  }

  async onLogout() {
    await this.router.navigate(['/logout']);
  }

  async onAvatarChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      if (file && this.user) {
        try {
          await this.avatarService.uploadAvatar(this.user.id, file);
          if (this.avatar) {
            await this.avatar.refresh();
          }

          this._snackBar.open('Avatár sikeresen feltöltve!', 'Bezárás', {
            duration: 5000
          });
        } catch (e) {
          this._snackBar.open('Nem sikerült feltölteni az avatart!', 'Bezárás', {
            duration: 5000
          });
        }
        return
      }
    }
    this._snackBar.open('Nincs kiválasztott fájl!', 'Bezárás', {
      duration: 5000
    });
  }

  onUploadButtonClick() {
    if (this.avatarInput) {
      this.avatarInput.nativeElement.click();
    }
  }
}
