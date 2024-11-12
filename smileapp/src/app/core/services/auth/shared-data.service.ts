import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private copValidado: string = '';

  setCop(cop: string) {
    this.copValidado = cop;
  }

  getCop(): string {
    return this.copValidado;
  }

  clearCop() {
    this.copValidado = '';
  }
}