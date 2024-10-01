import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { ClickEventDetails } from '../../types/traakConfiguration';
@Injectable({
  providedIn: 'root',
})
export class ClickService extends EventService<ClickEventDetails> {}
