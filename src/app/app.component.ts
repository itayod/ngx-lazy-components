import {Component, OnInit, Injector, ViewContainerRef} from '@angular/core';
import {LazyComponents, AfterViewLoaded} from './lazy-components';


@LazyComponents([{url: './lazy/lazy.component#LazyComponent'}])
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements AfterViewLoaded {
  title = 'ngx-lazy-components';

  constructor(private injector: Injector) {
    this.injector.get(ViewContainerRef);
  }

  public afterViewLoaded(): void {
  }
}
