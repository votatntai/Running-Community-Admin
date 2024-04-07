import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Pagination } from 'app/types/pagination.type';
import { Observable } from 'rxjs';
import { GroupService } from './group.service';
import { Group } from 'app/types/group.type';

@Injectable({
    providedIn: 'root'
})

export class GroupsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _groupService: GroupService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ pagination: Pagination; data: Group[] }> {
        return this._groupService.getGroups();
    }
}
