import { Type } from '@angular/core';
import * as L from 'leaflet';

export class PlotlyAppInfo {
  portfolioName: string;
  scenarioName: string;
  loadName: string;
  startDate: Date;
  endDate: Date;
  valueName: string;
  scope: string;
  chartType: string;

  constructor(portfolioName: string, scenarioName: string, loadName: string, startDate: Date, endDate: Date, valueName: string, scope: string, chartType: string) {
    this.portfolioName = portfolioName;
    this.scenarioName = scenarioName;
    this.loadName = loadName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.valueName = valueName;
    this.scope = scope;
    this.chartType = chartType;
  }

}
