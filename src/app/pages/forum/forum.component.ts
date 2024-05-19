import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryItemComponent} from "../../components/category-item/category-item.component";
import {Forum} from "../../models/forum";
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {LoadingComponent} from "../../components/loading/loading.component";
import {Thread} from "../../models/thread";
import {Subscription} from "rxjs";
import {ForumService} from "../../services/forum.service";
import {NgForOf} from "@angular/common";
import {ForumItemComponent} from "../../components/forum-item/forum-item.component";
import {ThreadItemComponent} from "../../components/thread-item/thread-item.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faFolderPlus} from "@fortawesome/free-solid-svg-icons";
import {MatDialog} from "@angular/material/dialog";
import {NewThreadComponent} from "../new-thread/new-thread.component";
import {AuthService} from '../../services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Post} from "../../models/post";

export interface DialogData {
  name: string;
  content: string;
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    CategoryItemComponent,
    LoadingComponent,
    NgForOf,
    ForumItemComponent,
    ThreadItemComponent,
    MatDividerModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatLabel,
    RouterLink,
    MatButton,
    FontAwesomeModule,
  ],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit, OnDestroy {

  private database: ForumService = inject(ForumService);
  private authService: AuthService = inject(AuthService);

  @Input()
  id: string | null = null;

  forum: Forum | null = null;
  forums: Forum[] | null = null;
  threads: Thread[] | null = null;

  private forumsSubscription: Subscription | null = null;
  private threadsSubscription: Subscription | null = null;
  private paramsSubscription: Subscription | null = null;

  private dialogData: DialogData | null = null;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.load();
    })
  }

  async load(): Promise<void> {
    if (this.id === null) {
      return;
    }

    this.forum = await this.database.getForumById(this.id);

    this.forumsSubscription = this.database.getForumsByParentId(this.id)
      .subscribe(forums => {
        this.forums = forums;
      });
    this.threadsSubscription = this.database.getThreadsByForumId(this.id)
      .subscribe(threads => {
        this.threads = threads;
      });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.forumsSubscription?.unsubscribe();
    this.threadsSubscription?.unsubscribe();
  }

  async openNewThreadDialog() {
    const dialogRef = this.dialog.open(NewThreadComponent, {
      data: {
        name: '',
        content: '',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === null) {
        return
      }
      this.dialogData = result;

      this.createThread();
    });
  }

  async createThread() {
    const user = await this.authService.currentUser;
    if (!user) {
      return;
    }

    if(this.dialogData == null) {
      return;
    }

    if(this.dialogData.name == null || this.dialogData.content == null) {
      this._snackBar.open('Érvénytelen téma adatok!', 'Bezárás', {
        duration: 5000,
      });
      return;
    }

    const name = this.dialogData.name;
    const content = this.dialogData.content;

    if(name.length < 3 || content.length < 3) {
      this._snackBar.open('A névnek és a tartalomnak legalább 3 karakter hosszúnak kell lennie.', 'Bezárás', {
        duration: 5000,
      });
      return;
    }

    const thread = {
      title: name,
      forumId: this.id,
      authorId: user.id,
      creationDate: new Date(),
      lastUpdate: new Date(),
      locked: false
    } as Thread;

    const ref = await this.database.createThread(thread);
    const threadId = ref.id;

    const post = {
      threadId: threadId,
      authorId: user.id,
      content: content,
      creationDate: new Date(),
      lastUpdate: new Date()
    } as Post;

    try {
      await this.database.createPost(post);
      this._snackBar.open('Téma sikeresen létrehozva.', 'Bezárás', {
        duration: 5000,
      });

      await this.router.navigate(['/thread', threadId]);
    } catch (e) {
      this._snackBar.open('Hiba történt a téma létrehozásakor', 'Bezárás', {
        duration: 5000,
      });
    }
  }

  protected readonly faFolderPlus = faFolderPlus;
}
