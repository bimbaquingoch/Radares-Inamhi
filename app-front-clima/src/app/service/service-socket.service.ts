import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ServiceSocketService {
  dataP00: any = [];

  constructor(private socket: Socket) {}

  getDataP00() {
    return this.socket.fromEvent('getDataP00').pipe(map((data: any) => data));
  }

  sendMessage() {
    this.socket.emit('allData');
  }


  getAllDataP00() {
    return this.socket
      .fromEvent('getAllDataP00')
      .pipe(map((data: any) => data));
  }
}
