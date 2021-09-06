import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../chart.service';
import { BarChart } from '../Iapi';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  data!: BarChart;
  svg!: SVGSVGElement;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.chartService.getApiData('barChart')
      .subscribe(response => {
        console.log(response);
        this.data = response[0] as BarChart;
        this.createSVG();
      });
  }
  createSVG(): void {
    if (!this.data) return;
    const [w, h] = [800, 400];
    const barW = w / this.data.data.length;
    const xValues = this.data.data.map(x => new Date(x[0]));
    const yValues = this.data.data.map(y => y[1]);
    const [xMin, xMax] = [d3.min(xValues), d3.max(xValues)];
    const [yMin, yMax] = [d3.min(yValues), d3.max(yValues)];

    if (!xMin || !xMax || !yMin || !yMax) return;
    const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([h, 0]);
    const svg = d3.select('#svgContainer')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('border', '2px solid black')
      .node();
    if (svg !== null) this.svg = svg;
  }
}
