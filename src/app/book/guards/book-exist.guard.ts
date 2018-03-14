/**
 * book-exist.guard
 */


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { select, Store } from '@ngrx/store';
import * as fromBooks from '../reducers';
import * as BookActions from '../actions/book';
import * as CollectionActions from '../actions/collection';
import { catchError, filter, map, switchMap, take, tap, toArray } from 'rxjs/operators';
import { GoogleBookService } from '../book.service';
import { of } from 'rxjs/observable/of';
import { Database } from '@ngrx/db';
import { Book } from '../book.model';

@Injectable()
export class BookExistGuard implements CanActivate {
    constructor( private store: Store<fromBooks.State>,
                 private db: Database,
                 private bookService: GoogleBookService ) {
    }

    public canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> | Promise<boolean> | boolean {

        return this.waitForCollectionToLoad().pipe(
            switchMap(() => this.hasBook(route.params['id']))
        );
    }

    private waitForCollectionToLoad(): Observable<boolean> {
        return this.store.pipe(
            select(fromBooks.getCollectionLoaded),
            switchMap(( loaded: boolean ) => {
                return loaded ? of(loaded) : this.hasCollectionLoaded();
            }),
            filter(loaded => loaded),
            take(1)
        );
    }

    private hasCollectionLoaded(): Observable<boolean> {
        return this.db.query('books').pipe(
            toArray(),
            map(( books: Book[] ) => new CollectionActions.LoadSuccess(books)),
            tap(( action: CollectionActions.LoadSuccess ) => this.store.dispatch(action)),
            map(() => true),
            catchError(() => of(false))
        );
    }

    private hasBook( id: string ): Observable<boolean> {
        return this.hasBookInStore(id).pipe(
            switchMap(( inStore: boolean ) => {
                if (inStore) {
                    return of(inStore);
                }

                return this.hasBookInApi(id);
            })
        );
    }

    private hasBookInStore( id: string ): Observable<boolean> {
        return this.store.pipe(
            select(fromBooks.getBookEntities),
            map(entities => !!entities[id]),
            take(1)
        );
    }

    private hasBookInApi( id: string ): Observable<boolean> {
        return this.bookService.retrieveBook(id).pipe(
            map(bookEntity => new BookActions.Load(bookEntity)),
            tap(( action: BookActions.Load ) => this.store.dispatch(action)),
            map(book => !!book),
            catchError(() => {
                return of(false);
            })
        );
    }
}
