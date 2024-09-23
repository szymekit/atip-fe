import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {PeriodicElement} from "../../services/periodic-table.service";
import {MatButton} from "@angular/material/button";

interface PeriodicElementForm {
  name: FormControl<string>;
  weight: FormControl<number>;
  symbol: FormControl<string>;
}

@Component({
  selector: 'app-edit-element-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatButton],
  templateUrl: './edit-element-dialog.component.html',
})
export class EditElementDialogComponent {
  form: FormGroup<PeriodicElementForm>;

  constructor(
    private fb: NonNullableFormBuilder,
    private dialogRef: MatDialogRef<EditElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
  ) {
    this.form = this.fb.group({
      name: [data.name],
      weight: [data.weight],
      symbol: [data.symbol],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.form.value);
  }
}
