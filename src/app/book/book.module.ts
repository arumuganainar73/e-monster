/**
 * book.module
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
} from '@angular/material';

import { reducers } from './reducers';
import { BookRoutingModule } from './book.routing';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { AddCommasPipe } from './pipes/add-commas.pipe';
import { BookComponent } from './book.component';
import { BookListComponent } from './book-list/book-list.component';
import { ShareModule } from '../share/share.module';

@NgModule({
    imports: [
        CommonModule,
        BookRoutingModule,
        ShareModule,

        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatButtonModule,

        StoreModule.forFeature('books', reducers),
    ],
    exports: [],
    declarations: [
        EllipsisPipe,
        AddCommasPipe,
        BookComponent,
        BookListComponent
    ],
    providers: [],
})
export class BookModule {
}

