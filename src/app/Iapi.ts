interface BarChart {
  data: [string, number][]
}
interface ScatterplotGraph {
  Time: string,
  Place: number,
  Seconds: number,
  Name: string,
  Year: number,
  Nationality: string,
  Doping: string,
  URL: string,
}
interface HeatMap {
  baseTemperature: number,
  monthlyVariance: { year: number, month: number, variance: number }[]
}
interface ChoroplethMap {
  fips: number,
  state: string,
  area_name: string,
  bachelorsOrHigher: number,
}
interface ChoroplethTopology {
  type: "Topology",
  objects: {
    counties: {
      type: string,
      geometries: {
        type: string,
        id: number,
        arcs: number[][]
      }[]
    },
    states: {
      type: string,
      geometries: {
        type: string,
        arcs: number[][][],
        id: string
      }[]
    },
    nation: {
      type: string,
      geometries: {
        type: string,
        arcs: number[][][]
      }[]
    },
  },
  arcs: number[][][],
  bbox: number[],
  transform: {
    scale: number[],
    translate: number[]
  }
}
interface TreemapDiagram {
  name: string,
  children: {
    name: string,
    children: {
      name: string,
      category: string,
      value: string
    }[]
  }[]
}
export {
  BarChart, ScatterplotGraph, HeatMap,
  ChoroplethMap, ChoroplethTopology, TreemapDiagram
};
