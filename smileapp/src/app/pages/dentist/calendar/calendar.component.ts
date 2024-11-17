import { Component, ViewChild } from '@angular/core';
import { CitaService } from '../../../core/services/cita/cita.service';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @ViewChild(FullCalendarComponent) fullCalendar: FullCalendarComponent | undefined;

  calendarOptions: CalendarOptions = {
    initialView:
      'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar:
    {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay, listWeek',
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short',
    },
    events: [] as EventInput[],
  };

  constructor(private citaService: CitaService) { }

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  loadCalendarEvents(): void {
    this.citaService.calendarCitas().subscribe({
      next: (events) => {
        console.log('Events received from backend:', events);
        this.calendarOptions = {
          ...this.calendarOptions,
          events: events as unknown as EventInput[], // Forzamos el tipo porque sabemos que coincide
        };
        console.log('Transformed events:', this.calendarOptions.events);
      },
      error: (err) => {
        console.error('Error loading calendar events:', err);
      },
    });
  }
}