import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
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
  svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
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
        this.createSVG();
      });
  }
  createSVG(): void {
    if (!this.dataMap || !this.dataTopology) return;
    const [w, h, p] = [1200, 800, 70];
    const us = this.dataTopology;
    const map = this.dataMap;
    const states = new Map(us.objects.counties.geometries.map(d => [d.id, map.find(obj => obj.fips === d.id, 0)?.area_name]));
    const statesDegree = new Map(map.map(x => [x.fips, x.bachelorsOrHigher]));

    console.log(statesDegree);
    const path = d3.geoPath();
    const color = d3.scaleQuantize([2, 76], d3.schemeBlues[9]); // 2 y 76 son el min/max de los porcentajes
    if (!us || !map || !states || !statesDegree) return;
    const topofeature = topojson.feature as any;
    const svg = d3.select('#svgContainer')
      .append('svg')
      .attr('width', w).attr('height', h)
      .style('border', '2px solid black');
    if (svg !== null) this.svg = svg;
    this.addAxisToSVG(p, h, color);
    this.addDataToSVG(topofeature, color, states, statesDegree, us, path);
  }
  addAxisToSVG(
    p: number, h: number, color: d3.ScaleQuantize<string, never>
  ): void {
    const colorAxisScale = d3.scaleLinear().range([p, h - p]).domain([2, 76]);
    const colorSample = [2, 10, 20, 30, 40, 50, 60, 70, 76];
    const colorAxis = d3.axisRight(colorAxisScale);
    // Leyenda Axis
    this.svg.append('g').append('svg')
      .attr('id', 'legend').attr('width', 300).attr('height', h - p)
      .attr('transform', `translate(900, 0)`);
    d3.select('#legend').append('g')
      .attr('transform', `translate(250, 0)`)
      .call(colorAxis);
    // Leyenda Colores
    d3.select('#legend').selectAll('rect')
      .data(d3.schemeBlues[9]).enter()
      .append('rect').attr('y', (d, i) => colorAxisScale(colorSample[i]))
      .attr('x', 190).attr('width', 50).attr('height', (h - p) - p / 8)
      .attr('fill', (d, i) => d3.schemeBlues[9][i]);
    // Leyenda Título
    d3.select('#legend').append('text')
      .text('Leyenda').attr('x', 150).attr('y', p / 1.5)
      .attr('fill', 'white').attr('font-size', '2rem');
    // Título
   this.svg.append('text')
      .text('Choropleth Map').attr('x', 150).attr('y', p / 1.5)
      .attr('fill', 'white').attr('font-size', '2rem')
      .attr('id', 'title');
    // Descripción
    this.svg.append('text')
      .text('Percentage of degree per State').attr('x', 150).attr('y', p * 1.5)
      .attr('fill', 'white').attr('font-size', '1.2rem')
      .attr('id', 'description');
  }
  addDataToSVG(
    topofeature: any, color: d3.ScaleQuantize<string, never>,
    states: Map<number, string | undefined>, statesDegree: Map<number, number>,
    us: ChoroplethTopology, path: any
  ): void {
    this.svg.append('g')
      .attr('transform', `translate(70, 140)`)
      .selectAll('path')
      .data(topofeature(us, us.objects.counties).features)
      .join('path')
      .attr('fill', (d: any) => color(statesDegree.get(d.id)!))
      .attr('d', path)
      .attr('class', 'county')
      .attr('data-fips', (d: any) => `${d.id!}`)
      .attr('data-state', (d: any) => `${states.get(d.id)!}`)
      .attr('data-education', (d: any) => `${statesDegree.get(d.id)!}`)
      .on('mouseover', e => {
        const state: string = e.target.dataset.state;
        const education: string = e.target.dataset.education;
        const [xUser, yUser] = [e.pageX, e.pageY];
        const div = document.querySelector('#tooltip') as HTMLDivElement;
        div.style.visibility = 'visible';
        div.style.top = `${yUser}px`;
        div.style.left = `${xUser + 20}px`;
        div.textContent = `${state}: ${education}%`;
        div.setAttribute('data-education', education);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      });
  }
}
