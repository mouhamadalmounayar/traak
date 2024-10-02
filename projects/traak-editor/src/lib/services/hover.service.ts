import { Injectable } from '@angular/core';
import { HoverEventDetails } from '../../types/traakConfiguration';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class HoverService extends EventService<HoverEventDetails> {}
