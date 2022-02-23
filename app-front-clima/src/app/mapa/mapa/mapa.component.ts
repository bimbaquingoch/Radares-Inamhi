import { Component, AfterViewInit } from '@angular/core';
import { MarkerService } from '../../service/marker.service';
import { ServiceSocketService } from '../../service/service-socket.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements AfterViewInit {

  constructor(
    private markerService: MarkerService,
    public serviceSocketService: ServiceSocketService
  ) {}

  ngOnInit(): void {
    

  }

  async ngAfterViewInit(): Promise<void> {}

  
}
