import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { TournamentsResolver } from './tournament.resolvers';

export default [
    {
        path: '',
        component: TournamentComponent,
        resolve: {
            tournaments: TournamentsResolver
        },
    },
] as Routes;
