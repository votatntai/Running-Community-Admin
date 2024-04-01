import { Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UsersResolver } from './user.resolvers';

export default [
    {
        path: '',
        component: UserComponent,
        resolve: {
            driver: UsersResolver
        },
    },
] as Routes;
