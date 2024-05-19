import {Component, inject, Input, OnInit} from '@angular/core';
import {AvatarService} from "../../services/avatar.service";
import {IMAGE_CONFIG, NgClass, NgStyle} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgClass,
    NgStyle
  ],
  providers: [
    {
      provide: IMAGE_CONFIG,
      useValue: {
        resizeMaxHeight: 100,
        resizeMaxWidth: 100,
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    }
  ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent implements OnInit {

  private service: AvatarService = inject(AvatarService);

  @Input()
  userId: string | null = null;

  @Input()
  size: number = 8;

  avatarUrl: string | null = null;

  constructor() {

  }

  async ngOnInit(): Promise<void> {
    if (this.userId === null) {
      return;
    }

    this.avatarUrl = await this.service.getAvatarUrl(this.userId);
  }

  async refresh() {
    await this.ngOnInit();
  }

  protected readonly faUser = faUser;
}
