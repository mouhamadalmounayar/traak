import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { OutEventDetails } from '../../types/traak-configuration';

@Injectable({
  providedIn: 'root',
})
export class OutService extends EventService<OutEventDetails> {}
