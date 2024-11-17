export interface citaModel {
  dentistId: number; // ID del dentista
  reason: string;
  date: string;  // Fecha en formato 'YYYY-MM-DD'
  hour: string;  // Hora en formato 'HH:mm'
  images?: File[];  // Archivos opcionales
}