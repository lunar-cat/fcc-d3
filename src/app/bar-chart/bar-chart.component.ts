import { HtmlAstPath } from '@angular/compiler';
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
  svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.chartService.getApiData('barChart')
      .subscribe(response => {
        this.data = response[0] as BarChart;
        this.createSVG();
      });
  }
  createSVG(): void {
    if (!this.data) return;
    const [w, h, p] = [1200, 600, 50];
    const barW = w / this.data.data.length;
    const xValues: Date[] = this.data.data.map(x => new Date(x[0]));
    const yValues: number[] = this.data.data.map(y => y[1]);
    const [xMin, xMax] = [d3.min(xValues), d3.max(xValues)];
    const [yMin, yMax] = [d3.min(yValues), d3.max(yValues)];

    if (!xMin || !xMax || !yMin || !yMax) return;
    const xScale = d3.scaleTime().domain([xMin, xMax]).range([p, w - p]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([h - p, p]);
    const svg = d3.select('#svgContainer')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('border', '2px solid black');
    if (svg !== null) this.svg = svg;
    this.addAxisToSVG(xScale, yScale, w, h, p);
    this.addDataToSVG(barW, xScale, yScale, h, p);
  }
  addAxisToSVG(xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    w: number, h: number, p: number): void {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    this.svg.append('g')
      .attr('transform', `translate(0, ${h - p})`)
      .attr('id', 'x-axis').call(xAxis);
    this.svg.append('g')
      .attr('transform', `translate(${p}, 0)`)
      .attr('id', 'y-axis').call(yAxis);
    this.svg.append('text')
      .attr('x', w / 2).attr('y', p / 2).text('Bar Chart')
      .attr('id', 'title');
  }
  addDataToSVG(barWidth: number,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    h: number, p: number): void {
    this.svg.append('g').attr('pointer-events', 'all')
      .on('mouseover', e => {
        const date: string = e.target.dataset.date;
        const value: string = e.target.dataset.gdp;
        const [xUser, yUser] = [e.clientX, e.clientY];
        const div = document.querySelector('#tooltip') as HTMLDivElement;
        div.style.visibility = 'visible';
        div.style.top = `${yUser}px`;
        div.style.left = `${xUser + 20}px`;
        div.textContent = `Fecha: ${date}\n Valor: $${value}`;
        div.setAttribute('data-date', date);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      })
      .selectAll('rect')
      .data(this.data.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('fill', 'purple')
      .attr('height', d => yScale(0) - yScale(d[1]))
      .attr('width', barWidth / 1.5)
      .attr('y', d => yScale(d[1]))
      .attr('x', d => xScale(new Date(d[0])));
  }
}
