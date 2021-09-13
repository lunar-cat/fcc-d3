import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from '../chart.service';
import { TreemapDiagram } from '../Iapi';

@Component({
  selector: 'app-treemap-diagram',
  templateUrl: './treemap-diagram.component.html',
  styleUrls: ['./treemap-diagram.component.scss']
})
export class TreemapDiagramComponent implements OnInit {
  dataSet!: TreemapDiagram[];
  data!: TreemapDiagram;
  svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }
  selectData(data: TreemapDiagram): void {
    this.data = data;
  }
  getData(): void {
    this.chartService.getApiData('treemapDiagram')
      .subscribe(response => {
        this.dataSet = response as TreemapDiagram[];
        this.selectData(this.dataSet[0]);
        this.createSVG();
      });
  }
  createSVG(): void {
    if (document.querySelector('#svgContainer>svg')) {
      const svg = document.querySelector('#svgContainer>svg');
      svg?.parentNode?.removeChild(svg);
    };
    if (!this.dataSet || !this.selectData) return;
    const [w, h, p] = [1800, 900, 100];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const treemap = (data: TreemapDiagram) => d3.treemap()
      .tile(d3.treemapSquarify)
      .size([w - p, h - p])
      .paddingInner(1)
      (d3.hierarchy(data)
        .sum((d: any) => d.value)
        .sort((a: any, b: any) => b.height - a.height || b.value! - a.value!));

    const root = treemap(this.data);

    this.svg = d3.select('#svgContainer')
      .append('svg').style('border', '2px solid white')
      .attr('width', w).attr('height', h);

    const leaf = this.svg.append('g')
      .attr('transform', `translate(${p}, ${p})`)
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    leaf.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', (d: any) => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
      .attr('class', 'tile')
      .attr('data-name', (d: any) => d.data.name)
      .attr('data-category', (d: any) => d.data.category)
      .attr('data-value', (d: any) => d.data.value)
      .on('mouseover', e => {
        const value: string = e.target.dataset.value;
        const name: string = e.target.dataset.name;
        const category: string = e.target.dataset.category;
        const [xUser, yUser] = [e.pageX, e.pageY];
        const div = document.querySelector('#tooltip') as HTMLDivElement;
        div.style.visibility = 'visible';
        div.style.top = `${yUser + 50}px`;
        if (xUser > window.innerWidth / 2) {
          div.style.left = `${xUser - (div.offsetWidth)}px`;
        } else {
          div.style.left = `${xUser}px`;
        }

        div.textContent = `Name: ${name} from ${category}.\nValue: ${value}`;
        div.setAttribute('data-value', value);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      });

    leaf.append('text')
      .append('tspan')
      .text((d: any) => d.value)
      .attr('x', 4)
      .attr('y', (d, i) => `20`)
      .attr('font-size', '0.7rem');

      this.addAxisToSVG(w, h, p, colorScale);
  }
  addAxisToSVG(
    w: number, h: number, p: number,
    colorScale: d3.ScaleOrdinal<string, string, never>
  ): void {

    // Título
    this.svg.append('text')
      .attr('x', p).attr('y', p / 2)
      .attr('fill', 'white').attr('font-size', '2rem')
      .text('Treemap Diagram').attr('id', 'title');
    // Descripción
    this.svg.append('text')
      .attr('x', p).attr('y', p / 1.2)
      .attr('fill', 'white').attr('font-size', '1.2rem')
      .text(`Sales grouped by: ${this.data.name}`).attr('id', 'description');
    // Leyenda 
    const nombres = colorScale.domain();

    this.svg.append('g')
      .append('svg')
      .attr('transform', 'translate(550, 0)')
      .attr('width', 1250).attr('height', p)
      .attr('id', 'legend')
      .selectAll('rect')
      .data(nombres)
      .enter()
      .append('rect')
      .attr('class', 'legend-item')
      .attr('width', 20).attr('height', 20)
      .attr('x', (d, i) => `${i * 20 * 3.2}`)
      .attr('y', (d, i) => `${i % 2 ? 15 : p / 1.5}`)
      .attr('fill', d => colorScale(d))

    this.svg.select('#legend')
      .selectAll('text')
      .data(nombres)
      .enter()
      .append('text')
      .attr('x', (d, i) => `${(i * 20 * 3.2) + 25}`).attr('y', (d, i) => `${i % 2 ? 30 : (p / 1.5) + 15}`)
      .append('tspan').text(d => d).attr('font-size', '0.8rem')
      .attr('fill', 'white')
  }
  addDataToSVG(): void {

  }
}
