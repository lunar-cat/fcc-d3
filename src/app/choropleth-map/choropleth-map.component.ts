import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { ChoroplethMap, ChoroplethTopology } from '../Iapi';

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.scss']
})
export class ChoroplethMapComponent implements OnInit {
  dataMap!: ChoroplethMap[];
  dataTopology!: ChoroplethTopology;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.chartService.getApiData('choroplethMap')
      .subscribe(response => {
        console.log(response[0]);
        this.dataMap = response[0] as ChoroplethMap[];
        this.dataTopology = response[1] as ChoroplethTopology;
      });
  }
}
