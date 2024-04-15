import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Group } from 'app/types/group.type';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupService {

    private _group: BehaviorSubject<Group | null> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<Group[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for group
 */
    get group$(): Observable<Group> {
        return this._group.asObservable();
    }

    /**
     * Getter for groups
     */
    get groups$(): Observable<Group[]> {
        return this._groups.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get groups
 *
 *
 */
    getGroups(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Group[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Group[] }>('/api/groups', {
            params: {
                pageSize: '' + pageSize,
                pageNumber: '' + pageNumber,
                sort,
                order,
                ...(status !== null && status !== undefined && { status }),
                name: search || ''
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._groups.next(response.data);
            }),
        );
    }

    /**
     * Get group by id
     */
    getGroupById(id: string): Observable<Group> {
        return this.groups$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<Group>('/api/groups/' + id).pipe(
                map((group) => {

                    // Set value for current group
                    this._group.next(group);

                    // Return the new contact
                    return group;
                })
            ))
        );
    }

    /**
* Create group
*/
    createGroup(data) {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) => this._httpClient.post<Group>('/api/groups', data).pipe(
                map((newGroup) => {

                    // Update group list with current page size
                    this._groups.next([newGroup, ...groups].slice(0, this._pagination.value.pageSize));

                    return newGroup;
                })
            ))
        )
    }

    /**
    * Update group
    */
    updateGroup(id: string, data) {
        return this.groups$.pipe(
            take(1),
            switchMap((groups) => this._httpClient.put<Group>('/api/groups/' + id, data).pipe(
                map((updatedGroup) => {

                    // Find and replace updated group
                    const index = groups.findIndex(item => item.id === id);
                    groups[index] = updatedGroup;
                    this._groups.next(groups);

                    // Update group
                    this._group.next(updatedGroup);

                    return updatedGroup;
                })
            ))
        )
    }
}