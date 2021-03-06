import { AfterContentInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

import * as fromBookRoot from '../reducers';
import { IBook } from '../../model';
import { AppService } from '../../app.service';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookListComponent implements OnInit, AfterContentInit, OnDestroy {

    public list$: Observable<IBook[]>;

    public paginatorData$: Observable<{page: number, total_pages: number, query: string}>;

    public navList = [
        {
            name: 'Top Fictions',
            value: 'combined-print-and-e-book-fiction',
            inform: 'The Best Sold Fictions in NYTimes.com(New York Times)'
        },
        {name: 'My Collection', value: 'collection', inform: 'My movie collection'},
    ];

    constructor( private router: Router,
                 private appService: AppService,
                 private store: Store<fromBookRoot.State> ) {
    }

    private scrollBackTopSub = Subscription.EMPTY;

    ngOnInit() {
        this.list$ = this.store.pipe(select(fromBookRoot.getSearchResults));
        this.paginatorData$ = this.store.pipe(select(fromBookRoot.getPaginatorData));
    }

    public ngAfterContentInit(): void {

        // Whenever we have new search results,
        // we scroll back to the top of the page.
        this.scrollBackTopSub = this.store.pipe(
            select(fromBookRoot.getSearchResults),
            skip(1)
        ).subscribe(() => {
            this.appService.scrollBackToTop(true);
        });
    }

    public ngOnDestroy(): void {
        this.scrollBackTopSub.unsubscribe();
    }

    public handleNavListOptionClick( option: string ) {
        option === 'collection' ?
            this.router.navigate(['book/collection']) :
            this.router.navigate(['book/list', option]);
    }

    /**
     * Go a specific page of the list
     * */
    public goToPage( page: number, query: string ): void {
        this.router.navigate(['book/list', query, {page}]);
    }
}
