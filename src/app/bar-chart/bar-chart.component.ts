import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { BarChart } from '../Iapi';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  data!: BarChart;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.chartService.getApiData('barChart')
      .subscribe(response => {
        console.log(response);
        this.data = response[0] as BarChart;
      });
  }
}
