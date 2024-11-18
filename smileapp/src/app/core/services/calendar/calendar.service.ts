import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor() { }

  formatEvents(events: any[]): EventInput[] {
    return events.map(event => this.formatEvent(event));
  }

  private formatEvent(event: any): EventInput {
    const backgroundColors = this.getBackgroundColors();  // Colores para el fondo
    const borderColors = this.getBorderColors(); 

    const eventIndex = Math.floor(Math.random() * backgroundColors.length);

    const backgroundColor = backgroundColors[eventIndex];
    const borderColor = borderColors[eventIndex];

    return {
      ...event,
      backgroundColor: backgroundColor, 
      color: borderColor,
      textColor: 'black',
    };
  }
 
  private getBackgroundColors(): string[] {
    return [
      '#BDFFDB',   // Verde suave
      '#FFEBB7',    // Amarillo pastel
      '#D6C8FF',    // Lila claro
      '#BFC6FF',    // Azul claro
      '#FFDDDD',    // Rosa claro
      '#A384FF',    // Morado claro
    ];
  }

  private getBorderColors(): string[] {
    return [
      '#2ECC71',    // Verde (más intenso)
      '#F39C12',    // Naranja
      '#9B59B6',    // Púrpura
      '#3498DB',    // Azul (más intenso)
      '#E74C3C',    // Rojo
      '#8E44AD',    // Violeta
    ];
  }
}