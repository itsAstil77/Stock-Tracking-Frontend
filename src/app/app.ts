import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CustomAlert } from './components/pages/custom-alert/custom-alert/custom-alert';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,CustomAlert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Stock-Tracking';
}
