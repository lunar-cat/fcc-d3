import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ScatterplotGraphComponent } from './scatterplot-graph/scatterplot-graph.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component';
import { TreemapDiagramComponent } from './treemap-diagram/treemap-diagram.component';

@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    ScatterplotGraphComponent,
    HeatMapComponent,
    ChoroplethMapComponent,
    TreemapDiagramComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
