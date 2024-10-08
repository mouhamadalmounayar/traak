import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { ClickEventDetails } from '../../types/traak-configuration';
@Injectable({
  providedIn: 'root',
})
export class ClickService extends EventService<ClickEventDetails> {}
