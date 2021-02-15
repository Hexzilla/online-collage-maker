import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})
export class SamplesComponent implements OnInit {

  masonryItems = [
    'assets/samples/canvas-sample-1.jpg',
    'assets/samples/canvas-sample-2.jpeg',
    'assets/samples/canvas-sample-3.jpg',
    'assets/samples/canvas-sample-4.jpg',
    'assets/samples/canvas-sample-5.jpg',
    'assets/samples/canvas-sample-6.jpeg',
    'assets/samples/canvas-sample-8.jpg',
    'assets/samples/canvas-sample-9.jpg',
    'assets/samples/canvas-sample-10.png',
    'assets/samples/canvas-sample-11.png',
  ];

  constructor(
    private title: Title
  ) {
    this.title.setTitle('Canvas Print Samples');
  }

  ngOnInit() {
  }

}
