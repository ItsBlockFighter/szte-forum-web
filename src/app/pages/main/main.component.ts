import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {MatList, MatListItem, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {CategoryItemComponent} from "../../components/category-item/category-item.component";
import {ForumService} from "../../services/forum.service";
import {Category} from "../../models/category";
import {Subscription} from 'rxjs';
import {NgForOf} from "@angular/common";
import {LoadingComponent} from "../../components/loading/loading.component";
import {CountPipe} from "../../pipes/count.pipe";
import {MatTable} from "@angular/material/table";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatList,
    MatListItem,
    MatLine,
    CategoryItemComponent,
    MatListSubheaderCssMatStyler,
    NgForOf,
    LoadingComponent,
    CountPipe,
    MatTable
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {

  private db: ForumService = inject(ForumService);

  categories: Category[] | null = null;
  categoriesSubscription: Subscription | null = null;

  usersCount: number = 0;
  threadsCount: number = 0;
  postsCount: number = 0;

  async ngOnInit(): Promise<void> {
    this.categoriesSubscription = this.db.getCategories()
      .subscribe(categories => {
        this.categories = categories;
      });

    this.usersCount = await this.db.totalUsers();
    this.threadsCount = await this.db.totalThreads();
    this.postsCount = await this.db.totalPosts();
  }

  ngOnDestroy(): void {
    this.categoriesSubscription?.unsubscribe();
  }
}
