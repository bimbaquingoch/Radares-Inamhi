import { Injectable } from '@angular/core';
import { ServiceSocketService } from '../service/service-socket.service';

import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  fillColor: string = '';
  opacity: number = 0;

  group1 = L.featureGroup();

  constructor(public serviceSocketService: ServiceSocketService) {}

  color(random: number) {
    random = random;

    switch (true) {
      case random <= 1:
        this.fillColor = 'rgb(255,255,180)';
        this.opacity = 0.02;
        break;
      case random > 1 && random <= 50:
        this.fillColor = 'rgb(255,255,0)';
        this.opacity = 0.03;
        break;
      case random > 50 && random <= 70:
        this.fillColor = 'rgb(204,255,80)';
        this.opacity = 0.04;
        break;
      case random > 70 && random <= 80:
        this.fillColor = 'rgb(124,252,0)';
        this.opacity = 0.04;
        break;
      case random > 80 && random <= 100:
        this.fillColor = 'rgb(50,205,50)';
        this.opacity = 0.06;
        break;
      case random > 100 && random <= 120:
        this.fillColor = 'rgb(0,191,255)';
        this.opacity = 0.08;
        break;
      case random > 120 && random <= 130:
        this.fillColor = 'rgb(0,0,255)';
        this.opacity = 0.1;
        break;
      case random > 130 && random <= 150:
        this.fillColor = 'rgb(138,43,226)';
        this.opacity = 0.12;
        break;
      case random > 150 && random <= 170:
        this.fillColor = 'rgb(139,0,130)';
        this.opacity = 0.14;
        break;
      case random > 170 && random <= 180:
        this.fillColor = 'rgb(178,34,34)';
        this.opacity = 0.15;
        break;
      case random > 180 && random <= 200:
        this.fillColor = 'rgb(220,20,60)';
        this.opacity = 0.15;
        break;
      case random > 200:
        this.fillColor = 'rgb(255,0,0)';
        this.opacity = 0.3;

        break;
    }
  }

  makeCapitalCircleMarkers(map: L.Map, i: number): void {
    this.group1.clearLayers();
    for (
      let j = 0;
      j < this.serviceSocketService.dataP00[i].features.length;
      j++
    ) {
      this.color(this.serviceSocketService.dataP00[i].features[j].mag);
      const lat =
        this.serviceSocketService.dataP00[i].features[j].coordinates[0];
      const lon =
        this.serviceSocketService.dataP00[i].features[j].coordinates[1];
      L.circleMarker([lat, lon], {
        radius: 10,
        color: 'none', 
        //this.fillColor,
        //weight: 0.01,
        fill: true,
        fillOpacity: this.opacity,
        fillColor: this.fillColor,
      }).addTo(this.group1);
      map.addLayer(this.group1);
    }
  }
}
