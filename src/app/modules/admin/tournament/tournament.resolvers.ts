import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Pagination } from 'app/types/pagination.type';
import { Observable } from 'rxjs';
import { TournamentService } from './tournament.service';
import { Tournament } from 'app/types/tournament.type';

@Injectable({
    providedIn: 'root'
})

export class TournamentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _tournamentService: TournamentService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: Pagination; data: Tournament[] }> {
        return this._tournamentService.getTournaments();
    }
}
