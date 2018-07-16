/**
 * people
 */
import { IMovie } from './movie';
import { ITv } from './tv';

export interface IActor {
    adult: boolean;
    also_known_as: any[];
    biography: string;
    birthday: string;
    deathday: string;
    gender: number;
    homepage: string;
    id: number;
    imdb_id: number;
    name: string;
    place_of_birth: string;
    popularity: number;
    profile_path: string;
    movie_credits: {
        cast: IMovie[],
        crew: IMovie[]
    };
    tv_credits: {
        cast: ITv[],
        crew: ITv[]
    };
    external_ids: {
        id: string,
        imdb_id: string,
        facebook_id: string,
        instagram_id: string,
        twitter_id: string
    };
}