import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Forum} from "../../models/forum";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faArrowRight, faBars, faComment, faFolder, faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import {MatBadge} from "@angular/material/badge";
import {MatDivider} from "@angular/material/divider";
import {MatTooltip} from "@angular/material/tooltip";
import {RouterLink} from "@angular/router";
import {LoadingComponent} from "../loading/loading.component";
import {ForumService} from "../../services/forum.service";

@Component({
  selector: 'app-forum-item',
  standalone: true,
  imports: [
    FontAwesomeModule,
    MatBadge,
    MatDivider,
    MatTooltip,
    RouterLink,
    LoadingComponent
  ],
  templateUrl: './forum-item.component.html',
  styleUrl: './forum-item.component.css'
})
export class ForumItemComponent implements OnInit, OnDestroy {

  private database: ForumService = inject(ForumService);

  @Input() forum: Forum | null = null;

  subForumsCount: number = 0;
  threadsCount: number = 0;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    if (this.forum === null) {
      return;
    }

    this.subForumsCount = await this.database.countForumsByParentId(this.forum.id)
    this.threadsCount = await this.database.countThreadsByForumId(this.forum.id);
  }

  ngOnDestroy(): void {
  }

  protected readonly faBars = faBars;
  protected readonly faFolder = faFolder;
  protected readonly faComment = faComment;
  protected readonly faFolderOpen = faFolderOpen;
  protected readonly faArrowRight = faArrowRight;
  protected readonly open = open;
}
