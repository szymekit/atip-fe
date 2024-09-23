import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {PeriodicTableComponent} from "./components/periodic-table/periodic-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PeriodicTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'atip-project';
}
