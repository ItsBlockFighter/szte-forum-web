import {Component, Inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {DialogData} from "../forum/forum.component";

@Component({
  selector: 'app-new-thread',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, RouterLink, NgIf, MatButton, MatDialogContent, MatDialogActions, MatDialogClose
  ],
  templateUrl: './new-thread.component.html',
  styleUrl: './new-thread.component.css'
})
export class NewThreadComponent {

  constructor(
    public dialogRef: MatDialogRef<NewThreadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
