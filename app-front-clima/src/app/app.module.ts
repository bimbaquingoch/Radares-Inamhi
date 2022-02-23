import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home/home.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { FilterPipeModule } from 'ngx-filter-pipe';

import { environment } from '../environments/environment';
import { ServiceSocketService } from './service/service-socket.service';
import { NgxOpenCVModule } from 'ngx-opencv';
import { MapaComponent } from './mapa/mapa/mapa.component';

import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './service/marker.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

const config: SocketIoConfig = { url: environment.url, options: {} };
@NgModule({
  declarations: [AppComponent, HomeComponent, MapaComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FilterPipeModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSliderModule,
    MatCardModule,
    MatRadioModule,
    FormsModule,
  ],
  providers: [ServiceSocketService, MarkerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
