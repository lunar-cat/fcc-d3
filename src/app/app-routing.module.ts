import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { ScatterplotGraphComponent } from './scatterplot-graph/scatterplot-graph.component';
import { TreemapDiagramComponent } from './treemap-diagram/treemap-diagram.component';

const routes: Routes = [
  {path: 'bar-chart', component: BarChartComponent},
  {path: 'choropleth-map', component: ChoroplethMapComponent},
  {path: 'heat-map', component: HeatMapComponent},
  {path: 'scatterplot-graph', component: ScatterplotGraphComponent},
  {path: 'treemap-diagram', component: TreemapDiagramComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
