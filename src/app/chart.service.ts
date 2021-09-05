import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  private apiRoutes = {
    barChart: {
      path: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json']
    },
    scatterplotGraph: {
      path: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json']
    },
    heatMap: {
      path: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json']
    },
    choroplethMap: {
      path: [
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
      ]
    },
    treemapDiagram: {
      path: [
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
      ]
    }
  }
  getApiData(type: apiOptions): Observable<{}[]> {
    const PATHS = this.apiRoutes[type].path;
    return forkJoin(PATHS.map(path => this.http.get(path)));
  }
}
type apiOptions = 'barChart' | 'scatterplotGraph' | 'heatMap' | 'choroplethMap' | 'treemapDiagram';
