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
    console.log(`Seleccionó: ${data.name}`);
    this.data = data;
  }
  getData(): void {
    this.chartService.getApiData('treemapDiagram')
      .subscribe(response => {
        console.log(response);
        this.dataSet = response as TreemapDiagram[];
        this.selectData(this.dataSet[0]);
        this.createSVG();
      });
  }
  createSVG(): void {
    if (document.querySelector('#svgContainer>svg')) {
      const svg = document.querySelector('#svgContainer>svg');
      svg?.parentNode?.removeChild(svg);
    }
    if (!this.dataSet || !this.selectData) return;
    const [w, h, p] = [1800, 900, 70];
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
      .append('svg').attr('width', w).attr('height', h);

    const leaf = this.svg.selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    leaf.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', (d: any) => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
      .attr('fill-opacity', 0.6)
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
        div.style.top = `${yUser}px`;
        div.style.left = `${xUser + 20}px`;
        div.textContent = `Name: ${name} from ${category}. Value of ${value}`;
        div.setAttribute('data-value', value);
      })
      .on('mouseout', e => {
        const tooltip = document.querySelector('#tooltip') as HTMLDivElement;
        tooltip.style.visibility = 'hidden';
      });

    leaf.append('text')
      .selectAll('tspan')
      .data((d: any) => d.data.name.split(' '))
      .enter()
      .append('tspan')
      .text((d: any) => d)
      .attr('x', 4)
      .attr('y', function (d, i) {
        return 13 + i * 20;
      })
      .attr('font-size', '0.8rem')
      .attr('font-family', 'verdana');

  }
  addAxisToSVG(): void {

  }
  addDataToSVG(): void {

  }
}
