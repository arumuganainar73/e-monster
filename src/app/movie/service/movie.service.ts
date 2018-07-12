/**
 * movie.service
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { IAudio, IGenre, IMovie, IReviews, IVideos } from '../../model';
import { TMDBService } from '../../tmdb';

@Injectable()
export class MovieService extends TMDBService {

    constructor( private http: HttpClient ) {
        super();
    }

    public searchList( query: string, page: number = 1 ): Observable<IAudio[]> {

        if (query === 'anticipated') {
            return this.getAnticipatedMovieList(page);
        }

        const url = this.base_url + `movie/${query}`;

        return this.getResult(url, [{name: 'page', value: page.toString()}], true).pipe(
            map(( res: any ) => {
                return {...res, query: query, type: 'movie'};
            }),
            catchError(this.handleError)
        );
    }

    public getAnticipatedMovieList( page: number ): Observable<IAudio[]> {
        const start = new Date();
        const end = new Date(start.getFullYear() + 2, start.getMonth(), start.getDate());
        const release_date_gte = start.toISOString().slice(0, 10);
        const release_date_lte = end.toISOString().slice(0, 10);

        const queries = [
            {name: 'language', value: 'en-US'},
            {name: 'sort_by', value: 'popularity.desc'},
            {name: 'include_adult', value: 'false'},
            {name: 'include_video', value: 'false'},
            {name: 'page', value: page.toString()},
            {name: 'release_date.gte', value: release_date_gte},
            {name: 'release_date.lte', value: release_date_lte},
            {name: 'with_release_type', value: '2|3'},
        ];

        return this.discoverMovieList('anticipated', queries);
    }

    public discoverMovieList( query: string, queries: Array<{ name: string, value: string }> ): Observable<IAudio[]> {
        const url = this.base_url + 'discover/movie';

        return this.getResult(url, queries, true).pipe(
            map(( res: any ) => {
                return {...res, query: query, type: 'movie'};
            }),
            catchError(this.handleError)
        );
    }

    public getMovieGenreList(): Observable<IGenre[]> {
        const url = 'https://api.themoviedb.org/3/genre/movie/list';

        return this.getResult(url).pipe(
            map(( res: any ) => res.genres),
            catchError(this.handleError)
        );
    }

    public getMovieVideos( id: number ): Observable<IVideos> {

        const url = this.base_url + `movie/${id}/videos`;

        return this.getResult(url).pipe(
            catchError(this.handleError)
        );
    }

    public getMovieReviews( id: number, page: number = 1 ): Observable<IReviews[]> {
        const url = this.base_url + `movie/${id}/reviews`;
        return this.getResult(url, [{name: 'page', value: page.toString()}]).pipe(
            catchError(this.handleError)
        );
    }

    public getMovie( id: number ): Observable<IMovie> {

        const details_url = this.base_url + `movie/${id}`;
        const queries = [
            {name: 'append_to_response', value: 'credits,reviews,external_ids,similar'},
        ];

        return this.getResult(details_url, queries).pipe(
            catchError(this.handleError)
        );
    }

    private getResult( url: string, queries?: Array<{ name: string, value: string }>, setRegion?: boolean ): Observable<any> {
        let params = new HttpParams();

        if (queries) {
            for (const query of queries) {
                params = params.set(query.name, query.value);
            }
        }

        if (setRegion) {
            params = params.set('region', this.region);
        }

        params = params.set('api_key', this.apikey);

        return this.http.get(url, {params: params});
    }

    private handleError( error: HttpErrorResponse ) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error.status_message}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(error.error.status_message);
    }
}