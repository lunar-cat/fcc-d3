import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../chart.service';
import { HeatMap } from '../Iapi';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})
export class HeatMapComponent implements OnInit {
  data!: HeatMap;
  svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.chartService.getApiData('heatMap')
      .subscribe(response => {
        this.data = response[0] as HeatMap;
        this.createSVG();
      });
  }
  createSVG(): void {
    if (!this.data) return;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const [w, h, p] = [1200, 800, 120];
    const xValues: Date[] = this.data.monthlyVariance.map(x => new Date(x.year, 0));
    const barWidth = (w) / new Set(this.data.monthlyVariance.map(x => x.year)).size;
    const yValues: number[] = this.data.monthlyVariance.map(x => x.month);
    const colorValues: number[] = this.data.monthlyVariance.map(x => x.variance);
    const [xMin, xMax] = [d3.min(xValues), d3.max(xValues)];
    const [yMin, yMax] = [d3.min(yValues), d3.max(yValues)];
    const [colorMin, colorMax] = [d3.min(colorValues), d3.max(colorValues)];

    if (!xMin || !xMax || !yMin || !yMax || !colorMin || !colorMax) return;
    const colorMinMax = Math.max(colorMin, colorMax);

    const xScale = d3.scaleTime().domain([xMin, xMax]).range([p, w - (p / 3)]);
    const yScale = d3.scaleBand().domain(months).range([p, h - p]);
    const colorScale = d3.scaleDiverging([-colorMinMax, 0, colorMinMax], t => d3.interpolateRdBu(1 - t));

    const svg = d3.select('#svgContainer')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('border', '2px solid black');
    if (svg !== null) this.svg = svg;
    this.addAxisToSVG(xScale, yScale, colorScale, w, h, p, months);
    this.addDataToSVG(xScale, yScale, yValues, xValues, months, colorScale, barWidth);
  }
  addAxisToSVG(
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleBand<string>,
    colorScale: d3.ScaleDiverging<string, never>,
    w: number, h: number, p: number, months: string[]
  ): void {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    const bands = ["-6", "-5", "-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6"];
    const colorAxisScale = d3.scaleBand().domain(bands).range([10, 290]);
    const colorAxis = d3.axisBottom(colorAxisScale);
    // Axis
    this.svg.append('g')
      .attr('transform', `translate(0, ${h - p})`)
      .attr('id', 'x-axis').call(xAxis);
    this.svg.append('g')
      .attr('transform', `translate(${p}, 0)`)
      .attr('id', 'y-axis').call(yAxis);
    // Título
    this.svg.append('text')
      .attr('x', p).attr('y', p / 2).text('Heat-map')
      .attr('id', 'title').attr('fill', 'white').attr('font-size', '2rem');
    // Descripción
    this.svg.append('text')
      .attr('x', p).attr('y', p / 1.2).text('Heat variation per month/year')
      .attr('id', 'description').attr('fill', 'white').attr('font-size', '1.2rem');

    // Leyenda Contenedor
    this.svg.append('g').append('svg')
      .attr('id', 'legend').attr('width', 300).attr('height', p)
      .attr('fill', 'white').attr('font-size', '1.2rem')
      .attr('transform', `translate(870, 0)`);
    // Leyenda Axis
    d3.select('#legend').append('g')
      .attr('transform', `translate(0, ${p / 1.3})`)
      .call(colorAxis);
    // Leyenda Colores
    d3.select('#legend').selectAll('rect').data(bands).enter().append('rect')
      .attr('x', d => colorAxisScale(d)!).attr('y', `${p / 1.7}`)
      .attr('width', d => colorAxisScale.bandwidth()).attr('height', '20').attr('fill', d => colorScale(+d));
    // Leyenda Título
    d3.select('#legend').append('text').text('Leyenda').attr('x', 10).attr('y', p / 2).attr('font-size', '2rem');
  }
  addDataToSVG(
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleBand<string>,
    yValues: number[], xValues: Date[], months: string[],
    colorScale: d3.ScaleDiverging<string, never>, barWidth: number
  ): void {
    this.svg.append('g')
      .on('mouseover', e => {
        const year: string = e.target.dataset.year;
        const temp: string = e.target.dataset.temp;
        const [xUser, yUser] = [e.pageX, e.pageY];
        const div = document.querySelector('#tooltip') as HTMLDivElement;
        div.style.visibility = 'visible';
        div.style.top = `${yUser}px`;
        div.style.left = `${xUser + 20}px`;
        div.textContent = `Año: ${year}\n Variación: ${temp}`;
        div.setAttribute('data-year', year);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      })
      .selectAll('rect')
      .data(this.data.monthlyVariance)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('data-year', (d, i) => `${xValues[i].getFullYear()}`)
      .attr('data-month', d => d.month - 1)
      .attr('data-temp', d => d.variance)
      .attr('width', barWidth)
      .attr('height', yScale.bandwidth())
      .attr('x', (d, i) => xScale(xValues[i]))
      .attr('y', (d, i) => yScale(months[d.month - 1])!)
      .attr('fill', d => colorScale(d.variance))
  }
}
