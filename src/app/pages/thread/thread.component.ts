import {AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ForumService} from "../../services/forum.service";
import {Post} from "../../models/post";
import {Thread} from "../../models/thread";
import {ForumItemComponent} from "../../components/forum-item/forum-item.component";
import {LoadingComponent} from "../../components/loading/loading.component";
import {MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {NgForOf, NgIf} from "@angular/common";
import {ThreadItemComponent} from "../../components/thread-item/thread-item.component";
import {PostComponent} from "../../components/post/post.component";
import {User} from "../../models/user";
import {UserAvatarComponent} from "../../components/user-avatar/user-avatar.component";
import {TimestampPipe} from "../../pipes/timestamp.pipe";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    ForumItemComponent,
    LoadingComponent,
    MatCard,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatDivider,
    NgForOf,
    ThreadItemComponent,
    PostComponent,
    UserAvatarComponent,
    TimestampPipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatPaginator,
    MatTable,
    MatColumnDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    FormsModule,
    ReactiveFormsModule,
    MatError,
    NgIf,
    MatIconButton
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.css'
})
export class ThreadComponent implements OnInit, OnDestroy, AfterViewInit {

  private database: ForumService = inject(ForumService);
  private authService: AuthService = inject(AuthService);

  @Input()
  id: string | null = null;

  author: User | null = null;

  thread: Thread | null = null;
  posts: Post[] | null = null;

  user: User | null = null;

  private paramsSubscription: Subscription | null = null;
  private postsSubscription: Subscription | null = null;
  private usersSubscription: Subscription | null = null;

  dataSource = new MatTableDataSource<Post>();
  pageSize = 10;
  currentPage = 0;
  totalSize = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;

  form: FormGroup;

  constructor(private route: ActivatedRoute, private _snackBar: MatSnackBar, private router: Router) {
    this.form = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.load();
    })

    this.usersSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  async load(): Promise<void> {
    if (this.id === null) {
      return;
    }

    this.thread = await this.database.getThreadById(this.id);
    this.author = await this.database.getUserById(this.thread.authorId);

    if (this.thread === null) {
      return;
    }

    this.postsSubscription = this.database.getPostsByThreadId(this.thread.id)
      .subscribe(posts => {
        this.posts = posts;

        this.loadData();
      });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.postsSubscription?.unsubscribe();
    this.usersSubscription?.unsubscribe();
  }

  async onSendMessage() {
    if (this.thread === null) {
      return;
    }
    if (this.form.invalid) {
      this._snackBar.open('Az üzenet nem lehet üres.', 'Bezárás', {
        duration: 5000,
      });
      return;
    }

    const user = await this.authService.currentUser;
    if (user === null) {
      this._snackBar.open('Be kell jelentkezned, hogy üzenetet küldhess.', 'Bezárás', {
        duration: 5000,
      });
      return;
    }

    const message = this.form.value.message;

    const post = {
      authorId: user.id,
      threadId: this.thread.id,
      content: message,
      creationDate: new Date(),
      lastUpdate: new Date()
    } as Post;

    try {
      await this.database.createPost(post);
      this.form.reset();
    } catch (e) {
      this._snackBar.open('Nem sikerült üzenetet küldeni', 'Bezárás', {
        duration: 5000,
      });
    }
  }

  pageChangeEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.loadData();
  }

  loadData() {
    if (this.posts === null) {
      return;
    }

    this.totalSize = this.posts.length;
    this.dataSource.data = this.posts.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize) || [];
  }

  async savePost(post: Post) {
    await this.database.updatePost(post);
  }

  async deletePost(post: Post) {
    await this.database.deletePost(post);
  }

  async onDeleteClick() {
    if (this.thread === null) {
      return;
    }

    const forumId = this.thread.forumId;

    await this.database.deleteThread(this.thread);
    await this.router.navigate(['/forum', forumId])
  }
}
