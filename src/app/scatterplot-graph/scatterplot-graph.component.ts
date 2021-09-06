import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../chart.service';
import { ScatterplotGraph } from '../Iapi';

@Component({
  selector: 'app-scatterplot-graph',
  templateUrl: './scatterplot-graph.component.html',
  styleUrls: ['./scatterplot-graph.component.scss']
})
export class ScatterplotGraphComponent implements OnInit {
  data!: ScatterplotGraph[];
  svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.chartService.getApiData('scatterplotGraph')
      .subscribe(response => {
        this.data = response[0] as ScatterplotGraph[];
        this.createSVG();
      });
  }
  createSVG(): void {
    if (!this.data) return;
    const [w, h, p, r] = [1200, 600, 50, 8];
    const xValues: Date[] = this.data.map(x => new Date(x.Year, 0));
    const yValues: number[] = this.data.map(x => (+x.Time.slice(0, 2) * 60) + +x.Time.slice(3));
    console.log(yValues); // Borrar
    const [xMin, xMax] = [d3.min(xValues), d3.max(xValues)];
    const [yMin, yMax] = [d3.max(yValues), d3.min(yValues)];
    // Acá dimos vuelta los valores, así invertimos el yAxis

    if (!xMin || !xMax || !yMin || !yMax) return;
    /* Acá agregé 1 año menos y 1 de más para hacer espacio, y que el círculo no quedara
    en el borde justo, lo mismo para el yScale con 20 segundos menos y más */
    const xScale = d3.scaleTime().domain([
      new Date(xMin.getTime()).setFullYear(xMin.getFullYear() - 1),
      new Date(xMax.getTime()).setFullYear(xMax.getFullYear() + 1)
    ]).range([p, w - p]);
    const yScale = d3.scaleLinear().domain([
      yMin + 20, yMax - 20
    ]).range([h - p, p]);

    const svg = d3.select('#svgContainer')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .style('border', '2px solid black');
    if (svg !== null) this.svg = svg;
    this.addAxisToSVG(xScale, yScale, w, h, p);
    this.addDataToSVG(r, xScale, yScale, yValues, xValues);
  }
  addAxisToSVG(xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    w: number, h: number, p: number): void {
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).tickFormat(v => `${new Date(+v * 1000).toISOString().slice(14, 19)}`);

    // Axis
    this.svg.append('g')
      .attr('transform', `translate(0, ${h - p})`)
      .attr('id', 'x-axis').call(xAxis);
    this.svg.append('g')
      .attr('transform', `translate(${p}, 0)`)
      .attr('id', 'y-axis').call(yAxis);
    // Título
    this.svg.append('text')
      .attr('x', w / 2).attr('y', p / 2).text('Scatterplot Graph')
      .attr('id', 'title');
    // Leyenda
    this.svg.append('g').attr('id', 'legend');
    d3.select('#legend').append('text')
      .attr('x', w - p * 4 - 5).attr('y', p / 2).text('Leyenda');

    d3.select('#legend').append('circle')
      .attr('cx', w - p * 4).attr('cy', p / 2 + 50)
      .attr('r', 10).attr('fill', 'orange');

    d3.select('#legend').append('circle')
      .attr('cx', w - p * 4).attr('cy', p / 2 + 100)
      .attr('r', 10).attr('fill', 'purple');
    
    d3.select('#legend').append('text')
      .attr('x', w - p * 4 + 15).attr('y', p / 2 + 50 + 5)
      .text('No acusado de Doping');

    d3.select('#legend').append('text')
      .attr('x', w - p * 4 + 15).attr('y', p / 2 + 100 + 5)
      .text('Acusado de Doping');
  }
  addDataToSVG(circleR: number,
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleLinear<number, number, never>,
    yValues: number[], xValues: Date[]): void {
    this.svg.append('g')
      .on('mouseover', e => {
        const year: string = e.target.dataset.xvalue;
        const time: Date = new Date(e.target.dataset.yvalue);
        const [xUser, yUser] = [e.clientX, e.clientY];
        const div = document.querySelector('#tooltip') as HTMLDivElement;
        div.style.visibility = 'visible';
        div.style.top = `${yUser}px`;
        div.style.left = `${xUser + 20}px`;
        div.textContent = `Año: ${year}\n Tiempo: ${(time).getMinutes()}:${time.getSeconds()}`;
        div.setAttribute('data-year', year);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      })
      .selectAll('circle')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => `${new Date(2020, 1, 1, 0, +d.Time.slice(0, 2), +d.Time.slice(3))}`)
      .attr('fill', d => `${d.Doping ? 'purple' : 'orange'}`)
      .attr('r', circleR)
      .attr('cx', (d, i) => xScale(xValues[i]))
      .attr('cy', (d, i) => yScale(yValues[i]))
      .attr('data-cy', (d, i) => yScale(xValues[i]));
  }
}
