import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../models/category";
import {NgForOf} from "@angular/common";
import {ForumItemComponent} from "../forum-item/forum-item.component";
import {LoadingComponent} from "../loading/loading.component";
import {Forum} from "../../models/forum";
import {ForumService} from '../../services/forum.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [
    NgForOf,
    ForumItemComponent,
    LoadingComponent
  ],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.css'
})
export class CategoryItemComponent implements OnInit, OnDestroy {

  private db: ForumService = inject(ForumService);

  @Input()
  category: Category | null = null;

  forums: Forum[] | null = null;

  forumsSubscription: Subscription | null = null;

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    if (this.category === null) {
      return;
    }

    this.forumsSubscription = this.db.getForumsByParentId(this.category.id)
      .subscribe(forums => {
        this.forums = forums;
      });
  }

  ngOnDestroy(): void {
    this.forumsSubscription?.unsubscribe();
  }
}
