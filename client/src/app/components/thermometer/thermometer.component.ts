import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-thermometer',
  templateUrl: './thermometer.component.html',
  styleUrls: ['./thermometer.component.css']
})
export class ThermometerComponent implements OnInit {
  //TODO: define Input fields and bind them to the template.
  @Input() featureName:string; //Name of the Audio Feature.
  @Input() featurePercentage:string; //The percentage of the Audio Feature.
  @Input() featureColor:string; //The color associate with the Audio Feature.

  constructor() { }

  ngOnInit() {
  }

}
