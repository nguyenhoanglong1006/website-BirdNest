import { Observable } from 'rxjs';
import { Attributes, HookSet } from './types';
export declare function lazyLoadImage<E>(hookSet: HookSet<E>, attributes: Attributes): (evntObservable: Observable<E>) => Observable<boolean>;
