import {Component, DestroyRef, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {RxState} from '@rx-angular/state';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {EditElementDialogComponent} from '../edit-element-dialog/edit-element-dialog.component';
import {PeriodicElement, PeriodicTableService} from "../../services/periodic-table.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './periodic-table.component.html',
})
export class PeriodicTableComponent extends RxState<{ filter: string | null }> {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  filterControl!: FormControl<string | null>
  filteredElements$: Observable<PeriodicElement[]>;

  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private service: PeriodicTableService,
    private dialog: MatDialog
  ) {
    super();
    this.filterControl = this.fb.control('');
    this.set({filter: null});

    this.filterControl.valueChanges.pipe(
      debounceTime(1000)
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(filterValue => {
      this.set({filter: filterValue});
    });

    this.filteredElements$ = this.select('filter').pipe(
      switchMap(filter =>
        this.service.elements$.pipe(
          map(elements =>
            elements.filter(element =>
                !filter || Object.values(element).some(value =>
                  value.toString().toLowerCase().includes(filter.toLowerCase())
                )
            )
          ),
          startWith([])
        )
      ),
      startWith([])
    );
  }

  openEditDialog(element: PeriodicElement) {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: {...element},
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (result) {
        this.service.updateElement(element.position, result);
      }
    });
  }
}
