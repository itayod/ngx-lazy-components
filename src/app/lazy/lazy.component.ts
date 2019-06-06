import {Component, OnInit, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {Service} from '../app.module';

@Component({
  selector: 'app-lazy',
  templateUrl: './lazy.component.html',
  styleUrls: ['./lazy.component.scss'],
})
export class LazyComponent implements OnInit {

  @Input() hello: string;

  constructor(private service: Service) { }

  ngOnInit() {
  }

}
