import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  constructor(
    private http: HttpClient
  ) { }
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  private apiUrls = [
    {
      name: 'barChart',
      url: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json']
    },
    {
      name: 'scatterplotGraph',
      url: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json']
    },
    {
      name: 'heatMap',
      url: ['https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json']
    },
    {
      name: 'choroplethMap',
      url: [
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
      ]
    },
    {
      name: 'treemapDiagram',
      url: [
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
        'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
      ]
    }
  ]
}
