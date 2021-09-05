import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';
import { TreemapDiagram } from '../Iapi';

@Component({
  selector: 'app-treemap-diagram',
  templateUrl: './treemap-diagram.component.html',
  styleUrls: ['./treemap-diagram.component.scss']
})
export class TreemapDiagramComponent implements OnInit {
  data!: TreemapDiagram[];
  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.chartService.getApiData('treemapDiagram')
      .subscribe(response => {
        console.log(response);
        this.data = response as TreemapDiagram[];
      });
  }
}
