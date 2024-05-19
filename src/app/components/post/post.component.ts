import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post";
import {MatCardModule} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {UserAvatarComponent} from "../user-avatar/user-avatar.component";
import {LoadingComponent} from "../loading/loading.component";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {TimestampPipe} from "../../pipes/timestamp.pipe";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    MatCardModule,
    NgOptimizedImage,
    UserAvatarComponent,
    LoadingComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    TimestampPipe,
    MatFormField,
    FormsModule,
    MatInput
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit, OnDestroy {

  private authService: AuthService = inject(AuthService);

  @Input()
  post: Post | null = null;

  @Output()
  save = new EventEmitter<Post>();

  @Output()
  delete = new EventEmitter<Post>();

  user: User | null = null;
  author: User | null = null;

  editedContent: string = '';

  static editing: string | null = null;

  constructor() {
  }

  async ngOnInit() {
    if (this.post === null) {
      return;
    }

    this.user = await this.authService.currentUser;
    this.author = await this.authService.getUserById(this.post.authorId);
  }

  ngOnDestroy() {
  }

  onEdit() {
    if (this.post === null) {
      return;
    }
    if (PostComponent.editing !== null) {
      return;
    }
    this.editedContent = this.post.content;
    this.toggleEditing();
  }

  async onDelete() {
    if (this.post === null) {
      return;
    }
    this.delete.emit(this.post);
  }

  async onSave() {
    if (this.post === null) {
      return;
    }
    if (this.editedContent === this.post.content) {
      return;
    }
    this.post.content = this.editedContent;
    this.toggleEditing();

    this.save.emit(this.post);
  }

  onCancel() {
    if (this.post === null) {
      return;
    }
    this.editedContent = this.post.content;
    this.toggleEditing();
  }

  toggleEditing() {
    if (this.post === null) {
      return;
    }
    if (PostComponent.editing === this.post.id) {
      PostComponent.editing = null;
    } else {
      PostComponent.editing = this.post.id;
    }
  }

  get editing() {
    return PostComponent.editing === this.post?.id;
  }
}
