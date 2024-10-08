import { animate, style, transition, trigger } from '@angular/animations';

export const appear = trigger('appear', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(5px)' }),
    animate('0.3s ease', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);
