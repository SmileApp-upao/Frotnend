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
    const colors = this.getEventColors();
    const color = this.getRandomColor(colors);
    return {
      ...event,
      backgroundColor: color, 
    };
  }
 
  private getRandomColor(colors: string[]): string {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
 
  private getEventColors(): string[] {
    return [
      '#BDFFDB',   
      '#FFEBB7',  
      '#D6C8FF',  
      '#BFC6FF',   
      '#FFDDDD',  
      '#A384FF',  
    ];
  }
}