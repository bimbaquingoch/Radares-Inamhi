import { Component, OnInit } from '@angular/core';
import { ServiceSocketService } from '../../service/service-socket.service';
import { MarkerService } from '../../service/marker.service';
import * as L from 'leaflet';
import { environment } from '../../../environments/environment';
import {
  faPlay,
  faStop,
  faSync,
  faStepBackward,
  faStepForward,
  faPause,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private map: any;

  //Propiedades del mapa
  mapboxUrl: string =
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' +
    environment.mapboxAccessToken;
  maxZoom: number = 13;
  minZoom: number = 10;
  attribution: string =
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  //iconos
  faPlay = faPlay;
  faStop = faStop;
  faSync = faSync;
  faStepBackward = faStepBackward;
  faStepForward = faStepForward;
  faPause = faPause;

  value = 0;
  max: number = 288;
  date: string = 'a.m.';
  play: boolean = true;

  ultimaPosi = 0;
  intervalo: any;

  constructor(
    private markerService: MarkerService,
    public serviceSocketService: ServiceSocketService
  ) {
    var d = new Date();
    this.date =
      [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') +
      ' ' +
      [d.getHours(), d.getMinutes()].join(':');
    console.log(this.date);
  }

  ngOnInit(): void {
    //Agregamos el mapa
    this.initMap();
    /*
    Emitimos un mensaje al server web socket para establecer la conexión
    */
    this.serviceSocketService.sendMessage();

    /*
    Recibimos la informacion del server web socket
    */
    this.serviceSocketService.getAllDataP00().subscribe((data) => {
      /*
      Obtenemos la información del radar y la almacenamos
      en un array
      */
      this.serviceSocketService.dataP00 = data;
      //Llamamos a la función agregar puntos
      this.agregarPuntos(1000, 0);
    });

    /*
    Servicio a la espera de nueva información del radar
    */
    this.serviceSocketService.getDataP00().subscribe((data) => {
      //Actualizamos nuestro array añadiendole nueva información al final
      this.serviceSocketService.dataP00.push(data);

      if (this.play == true) {
        clearInterval(this.intervalo);
        //Agregamos los nuevos puntos en el mapa
        this.value = this.serviceSocketService.dataP00.length - 1;
        this.getDate(this.value);

        this.markerService.makeCapitalCircleMarkers(this.map, this.value);
      }
    });
  }

  private initMap(): void {
    //Agregamos el fondo del mapa segun su estilo
    var grayscale = L.tileLayer(this.mapboxUrl, {
        id: 'mapbox/light-v10',
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        attribution: this.attribution,
      }),
      satelite = L.tileLayer(this.mapboxUrl, {
        id: 'mapbox/satellite-streets-v11',
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        attribution: this.attribution,
      }),
      streets = L.tileLayer(this.mapboxUrl, {
        id: 'mapbox/outdoors-v11',
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
        attribution: this.attribution,
      });

    var baseMaps = {
      Grayscale: grayscale,
      Streets: streets,
      Satelite: satelite,
    };

    //Inicializamos el mapa
    this.map = L.map('map', {
      center: [-0.225219, -78.5248],
      zoom: 11,
      layers: [grayscale],
    });

    //definimos dos radios desde el centro del radar
    const circle20km = L.circle([-0.2338888, -78.47722], {
      radius: 20000,
      fill: false,
    }).bindPopup('Rango 20km');

    const circle60km = L.circle([-0.2338888, -78.47722], {
      radius: 60000,
      fill: false,
      color: 'yellow',
    }).bindPopup('Rango 60km');

    //definimos las propiedades del Icono torre
    const fontAwesomeIcon = L.icon({
      iconUrl: '../../assets/broadcast-tower-solid.svg',
      iconSize: [30, 30],
      iconAnchor: [22, 20],
      popupAnchor: [-10, -30],
    });

    //Insertar Icono de torre de radar en mapa
    const marker = L.marker([-0.2338888, -78.47722], {
      icon: fontAwesomeIcon,
    }).bindPopup('Radar Monjas');

    L.control.layers(baseMaps).addTo(this.map);

    circle20km.addTo(this.map);
    circle60km.addTo(this.map);
    marker.addTo(this.map);
  }

  //Funcion para retrodecer un fotograma
  Atras() {
    //Validamos que exista fotogramas por recorrer
    if (this.value > 0 && this.serviceSocketService.dataP00.length > 0) {
      //Del fotogrma actual retrocedemos en menos uno
      this.value = this.value - 1;
      this.getDate(this.value);
      this.markerService.makeCapitalCircleMarkers(this.map, this.value);
    }
  }

  //Funcion para adelantar un fotograma
  Adelante() {
    //Validamos que exista fotogramas por recorrer
    if (
      this.value < this.serviceSocketService.dataP00.length - 1 &&
      this.serviceSocketService.dataP00.length > 0
    ) {
      this.value = this.value + 1;
      this.getDate(this.value);
      this.markerService.makeCapitalCircleMarkers(this.map, this.value);
    }
  }

  Pausar() {
    this.play = !this.play;
    if (this.play == false && this.serviceSocketService.dataP00.length > 0) {
      clearInterval(this.intervalo);
      this.markerService.makeCapitalCircleMarkers(this.map, this.ultimaPosi);
    } else {
      this.agregarPuntos(500, this.ultimaPosi);
    }
  }

  changeValue(event: any) {
    if (event.value < this.serviceSocketService.dataP00.length) {
      this.getDate(event.value);
      this.markerService.makeCapitalCircleMarkers(this.map, event.value);
      this.ultimaPosi = event.value;
    }
  }

  agregarPuntos(tiempo: number, index: number): void {
    if (this.serviceSocketService.dataP00.length > 0) {
      var i = index;
      this.intervalo = setInterval(() => {
        if (i == this.serviceSocketService.dataP00.length - 1) {
          clearInterval(this.intervalo);
        }
        this.markerService.makeCapitalCircleMarkers(this.map, i);
        this.ultimaPosi = i;
        this.getDate(i);
        i += 1;
      }, tiempo);
    }
  }

  getDate(index: number) {
    const hora = Number(
      this.serviceSocketService.dataP00[index].time.substr(-5, 2)
    );

    if (hora >= 0 && hora < 13) {
      this.date = this.serviceSocketService.dataP00[index].time + ' a.m.';
    } else {
      this.date = this.serviceSocketService.dataP00[index].time + ' p.m.';
    }
    this.value = index;
  }
}
