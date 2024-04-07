import { Routes } from '@angular/router';
import { GroupComponent } from './group.component';
import { GroupsResolver } from './group.resolvers';

export default [
    {
        path: '',
        component: GroupComponent,
        resolve: {
            groups: GroupsResolver
        },
    },
] as Routes;
