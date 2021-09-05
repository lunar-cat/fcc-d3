import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { HeatMap } from '../Iapi';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  data!: HeatMap;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  
  getData(): void {
    this.chartService.getApiData('heatMap')
      .subscribe(response => {
        console.log(response);
        this.data = response[0] as HeatMap;
      });
  }
}
