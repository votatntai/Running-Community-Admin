import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { TournamentDetailComponent } from './detail/tournament-detail.component';
import { TournamentComponent } from './tournament.component';
import { TournamentService } from './tournament.service';
import { UserTournamentService } from './user-tournament/user-tournament.service';
import { UserTournamentComponent } from './user-tournament/user-tournament.component';

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
                children: [
                    {
                        path: 'users',
                        component: UserTournamentComponent, // Giả sử bạn có một component riêng cho route này
                        resolve: {
                            userTournament: (route: ActivatedRouteSnapshot) => inject(UserTournamentService).getUserTournaments(route.parent.params['id']),
                        }
                    }
                ]
            }
        ]
    },
] as Routes;

