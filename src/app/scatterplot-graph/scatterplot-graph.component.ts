import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { ScatterplotGraph } from '../Iapi';

@Component({
  selector: 'app-scatterplot-graph',
  templateUrl: './scatterplot-graph.component.html',
  styleUrls: ['./scatterplot-graph.component.scss']
})
export class ScatterplotGraphComponent implements OnInit {
  data!: ScatterplotGraph[];
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.chartService.getApiData('scatterplotGraph')
      .subscribe(response => {
        console.log(response);
        this.data = response[0] as ScatterplotGraph[];
      });
  }
}
