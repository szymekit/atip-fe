import {Injectable} from '@angular/core';
import {RxState} from '@rx-angular/state';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, delay} from 'rxjs/operators';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Injectable({
  providedIn: 'root'
})
export class PeriodicTableService extends RxState<{ elements: PeriodicElement[], error: string | null }> {
  private elementsSubject = new BehaviorSubject<PeriodicElement[]>(ELEMENT_DATA);

  elements$ = this.elementsSubject.asObservable();

  constructor() {
    super();
    this.set({elements: ELEMENT_DATA, error: null});
  }

  fetchElements(): Observable<PeriodicElement[]> {
    return of(ELEMENT_DATA).pipe(
      delay(1000), // Simulate a delay
      catchError(error => {
        this.set({error: 'Failed to fetch elements'});
        return throwError(() => new Error('Failed to fetch elements'));
      })
    );
  }

  updateElement(position: number, newValue: Partial<PeriodicElement>) {
    this.elementsSubject.next(
      this.elementsSubject.value.map(element =>
        element.position === position ? {...element, ...newValue} : element
      )
    );
  }
}
