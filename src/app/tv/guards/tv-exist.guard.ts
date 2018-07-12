/**
 * tv-exist.guard
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import * as fromTvRoot from '../reducers';
import * as searchActions from '../../search/actions';
import * as tvActions from '../actions/tv';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { TvService } from '../service/tv.service';

@Injectable()
export class TvExistGuard implements CanActivate {
    constructor( private store: Store<fromTvRoot.State>,
                 private tvService: TvService ) {
    }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {
        return this.hasTv(route.params['id']);
    }

    private hasTv( id: number ): Observable<boolean> {
        return this.hasTvInStore(id).pipe(
            tap(() => this.store.dispatch(new searchActions.SetSearchType('tv'))),
            switchMap(inStore => {
                if (inStore) {
                    return of(inStore);
                }

                return this.hasTvInApi(id);
            })
        );
    }

    private hasTvInStore( id: number ): Observable<boolean> {
        return this.store.pipe(
            select(fromTvRoot.getTvEntities),
            map(entities => !!entities[id]),
            take(1)
        );
    }

    private hasTvInApi( id: number ): Observable<boolean> {
        this.store.dispatch(new searchActions.LoadingStart());

        return this.tvService.getTv(id).pipe(
            map(res => new tvActions.Load(res)),
            tap(( action: tvActions.Load ) => {
                this.store.dispatch(action);
                this.store.dispatch(new searchActions.LoadingCompleted());
            }),
            map(res => !!res.payload),
            catchError(() => {
                // TODO: navigate to 404
                return of(false);
            })
        );
    }
}