import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { TournamentDetailComponent } from './detail/tournament-detail.component';
import { TournamentComponent } from './tournament.component';
import { TournamentService } from './tournament.service';

export default [
    {
        path: '',
        component: TournamentComponent,
        resolve: {
            tournaments: () => inject(TournamentService).getTournaments(),
        },
        children: [
            {
                path: ':id',
                component: TournamentDetailComponent,
                resolve: {
                    tournament: (route: ActivatedRouteSnapshot) => inject(TournamentService).getTournamentById(route.params['id']),
                },
            }
        ]
    },
] as Routes;
