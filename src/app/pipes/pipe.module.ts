import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentStatusPipe } from './tournament-status-pipe/tournament-status.pipe';
import { GroupStatusPipe } from './tournament-status-pipe/group-status.pipe';
import { UserStatusPipe } from './tournament-status-pipe/user-status.pipe';

@NgModule({
    declarations: [
        TournamentStatusPipe,
        GroupStatusPipe,
        UserStatusPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TournamentStatusPipe,
        GroupStatusPipe,
        UserStatusPipe
    ]
})
export class PipesModule { }
