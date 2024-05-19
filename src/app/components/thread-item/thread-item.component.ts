import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {
  faArrowRight,
  faBars,
  faComment,
  faFolder,
  faFolderOpen,
  faLock,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import {LoadingComponent} from "../loading/loading.component";
import {MatTooltip} from "@angular/material/tooltip";
import {Thread} from "../../models/thread";
import {MatBadge} from "@angular/material/badge";
import {RouterLink} from "@angular/router";
import {User} from "../../models/user";
import {ForumService} from '../../services/forum.service';
import {MatDivider} from "@angular/material/divider";
import {TimestampPipe} from "../../pipes/timestamp.pipe";
import {UserAvatarComponent} from "../user-avatar/user-avatar.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-thread-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    LoadingComponent,
    MatTooltip,
    MatBadge,
    RouterLink,
    MatDivider,
    TimestampPipe,
    UserAvatarComponent,
    NgIf
  ],
  templateUrl: './thread-item.component.html',
  styleUrl: './thread-item.component.css'
})
export class ThreadItemComponent implements OnInit, OnDestroy {

  private db: ForumService = inject(ForumService);

  @Input() thread: Thread | null = null;

  author: User | null = null;
  postsCount: number = 0;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    if (this.thread === null) {
      return;
    }

    this.author = await this.db.getUserById(this.thread.authorId);
    this.postsCount = await this.db.countPostsByThreadId(this.thread.id);
  }

  ngOnDestroy(): void {
  }

  protected readonly faBars = faBars;
  protected readonly faFolder = faFolder;
  protected readonly faComment = faComment;
  protected readonly faFolderOpen = faFolderOpen;
  protected readonly faArrowRight = faArrowRight;
  protected readonly open = open;
  protected readonly faUser = faUser;
  protected readonly faLock = faLock;
}
