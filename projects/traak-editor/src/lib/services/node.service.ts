import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDetails } from '../../types/traakConfiguration';
@Injectable({
  providedIn: 'root',
})
export class NodeService {
  details?: EventDetails;
  hoverSubject: BehaviorSubject<EventDetails | undefined> = new BehaviorSubject<
    EventDetails | undefined
  >(this.details);
  hover$: Observable<EventDetails | undefined> =
    this.hoverSubject.asObservable();
  outSubject: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  out$: Observable<null> = this.outSubject.asObservable();
  constructor() {}
  sendHoverDetails(details: EventDetails) {
    this.hoverSubject.next(details);
  }
  sendEvent(): void {
    this.outSubject.next(null);
  }
}
