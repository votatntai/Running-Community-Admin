import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { UserTournament } from 'app/types/user-tournament.type';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserTournamentService {

    private _userTournament: BehaviorSubject<UserTournament | null> = new BehaviorSubject(null);
    private _userTournaments: BehaviorSubject<UserTournament[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for userTournament
 */
    get userTournament$(): Observable<UserTournament> {
        return this._userTournament.asObservable();
    }

    /**
     * Getter for userTournaments
     */
    get userTournaments$(): Observable<UserTournament[]> {
        return this._userTournaments.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get userTournaments
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getUserTournaments(id: string, pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search?: string, status?: string):
        Observable<{ pagination: Pagination; data: UserTournament[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: UserTournament[] }>('/api/user-tournaments', {
            params: {
                tournamentId: id,
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
                this._userTournaments.next(response.data);
            }),
        );
    }
}