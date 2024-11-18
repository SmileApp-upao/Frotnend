import { Component, ViewChild } from '@angular/core';
import { CitaService } from '../../../core/services/cita/cita.service';
import { CalendarService  } from '../../../core/services/calendar/calendar.service';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list'; 
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/user/patient/patient.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @ViewChild(FullCalendarComponent) fullCalendar: FullCalendarComponent | undefined;

  selectedEventDetails: any = null;  

  constructor(
    private citaService: CitaService, 
    private calendarService: CalendarService,
    private router: Router,
    private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  // Opciones para el calendario secundario
  monthlyCalendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin], 
    titleFormat: { year: 'numeric', month: 'short' },
    dayHeaderFormat: { weekday: 'narrow' },
    events: [] as EventInput[],
    eventClick: this.handleEventClick.bind(this),
    locale: 'es',
  };

  // Opciones para el calendario principal
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short',
    },
    allDaySlot: false,
    events: [] as EventInput[],
    eventClick: this.handleEventClick.bind(this),
    locale: 'es', 
  };

  // Carga de eventos al calendario
  loadCalendarEvents(): void {
    this.citaService.calendarCitas().subscribe({
      next: (events) => {
        const formattedEvents = this.calendarService.formatEvents(events).map(event => ({
          ...event,
          extendedProps: {
            ...event.extendedProps,    
            patientId: event['patientId'], 
            quoteId: event.id          
          }
        }));
        // Asignamos los eventos formateados a las opciones del calendario
        this.calendarOptions = {
          ...this.calendarOptions,
          events: formattedEvents, // Aplicamos los mismos eventos al calendario mensual
        };
        this.monthlyCalendarOptions = {
          ...this.monthlyCalendarOptions,
          events: formattedEvents, // Si no se desea aplicar color: events as unknown as EventInput[]
        };
      },
      error: (err) => {
        console.error('Error loading calendar events:', err);
      },
    });
  }

  // Manejo de la selección de eventos
  handleEventClick(clickInfo: EventClickArg): void {
    const { title, start, extendedProps } = clickInfo.event;
    this.selectedEventDetails = {
      title,
      start,
      ...extendedProps,
    };
    
    const patientId = extendedProps['patientId'];
    const quoteId = extendedProps['quoteId'];
    this.selectedEventDetails.patientId = patientId;
    this.selectedEventDetails.quoteId = quoteId;
  } 

  goToPatientProfile(): void {
    const patientId = this.selectedEventDetails?.patientId; 
    const quoteId = this.selectedEventDetails?.quoteId; 
    this.router.navigate(['/dentist/quote-view'], { queryParams: { patientId, quoteId } });
  }
  
}