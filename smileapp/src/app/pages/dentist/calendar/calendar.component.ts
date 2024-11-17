import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core'; // Interfaz para las opciones de configuración de FullCalendar
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';  // Plugin para la vista mensual
import timeGridPlugin from '@fullcalendar/timegrid'; 
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',  // Vista inicial como mes
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],    
    headerToolbar: { // Configuración de la barra de herramientas
      left: 'prev,next today',  // Botones para navegar entre fechas
      center: 'title',          // Título central (por ejemplo, "November 2024")
      right: 'dayGridMonth,timeGridWeek,timeGridDay, listWeek',  // Botones de vistas: mes, semana, día
      
    },
    eventTimeFormat: { // Formato para la hora de los eventos
      hour: '2-digit', 
      minute: '2-digit',
      meridiem: 'short',  // Agrega "AM" o "PM" (si es necesario)
    },
    events: [
      { title: 'Evento 1', date: '2024-11-20T10:00:00' },
      { title: 'Evento 2', date: '2024-11-20T10:15:00' },
    ],
  };
}
