import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Tournament } from 'app/types/tournament.type';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TournamentService {

    private _tournament: BehaviorSubject<Tournament | null> = new BehaviorSubject(null);
    private _tournaments: BehaviorSubject<Tournament[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for tournament
 */
    get tournament$(): Observable<Tournament> {
        return this._tournament.asObservable();
    }

    /**
     * Getter for tournaments
     */
    get tournaments$(): Observable<Tournament[]> {
        return this._tournaments.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get tournaments
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getTournaments(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Tournament[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Tournament[] }>('/api/tournaments', {
            params: {
                pageSize: '' + pageSize,
                pageNumber: '' + pageNumber,
                sort,
                order,
                ...(status !== null && status !== undefined && { status }),
                title: search || ''
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._tournaments.next(response.data);
            }),
        );
    }

    /**
     * Get tournament by id
     */
    getTournamentById(id: string): Observable<Tournament> {
        return this.tournaments$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Tournament>('/api/tournaments/' + id).pipe(
                map((tournament) => {

                    // Set value for current tournament
                    this._tournament.next(tournament);

                    console.log(tournament);

                    // Return the new contact
                    return tournament;
                })
            ))
        );
    }

    /**
* Create tournament
*/
    createTournament(data) {
        return this.tournaments$.pipe(
            take(1),
            switchMap((tournaments) => this._httpClient.post<Tournament>('/api/tournaments', data).pipe(
                map((newTournament) => {

                    // Update tournament list with current page size
                    this._tournaments.next([newTournament, ...tournaments].slice(0, this._pagination.value.pageSize));

                    return newTournament;
                })
            ))
        )
    }

    /**
    * Update tournament
    */
    updateTournament(id: string, data) {
        return this.tournaments$.pipe(
            take(1),
            switchMap((tournaments) => this._httpClient.put<Tournament>('/api/tournaments/' + id, data).pipe(
                map((updatedTournament) => {

                    // Find and replace updated tournament
                    const index = tournaments.findIndex(item => item.id === id);
                    tournaments[index] = updatedTournament;
                    this._tournaments.next(tournaments);

                    // Update tournament
                    this._tournament.next(updatedTournament);

                    return updatedTournament;
                })
            ))
        )
    }
}