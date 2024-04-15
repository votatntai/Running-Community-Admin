import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Pagination } from 'app/types/pagination.type';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for user
 */
    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Getter for users
     */
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get users
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getUsers(pageNumber: number = 0, pageSize: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search?: string, status?: string):
        Observable<{ pagination: Pagination; data: User[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: User[] }>('/api/users', {
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
                this._users.next(response.data);
            }),
        );
    }

    /**
     * Get user by id
     */
    getUserById(id: string): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap(() => this._httpClient.get<User>('/api/users/' + id).pipe(
                map((user) => {

                    // Set value for current user
                    this._user.next(user);

                    // Return the new contact
                    return user;
                })
            ))
        );
    }

    /**
* Create user
*/
    createUser(data) {
        return this.users$.pipe(
            take(1),
            switchMap((users) => this._httpClient.post<User>('/api/users', data).pipe(
                map((newUser) => {

                    // Update user list with current page size
                    this._users.next([newUser, ...users].slice(0, this._pagination.value.pageSize));

                    return newUser;
                })
            ))
        )
    }

    /**
    * Update user
    */
    updateUser(id: string, data) {
        return this.users$.pipe(
            take(1),
            switchMap((users) => this._httpClient.put<User>('/api/users/' + id, data).pipe(
                map((updatedUser) => {

                    // Find and replace updated user
                    const index = users.findIndex(item => item.id === id);
                    users[index] = updatedUser;
                    this._users.next(users);

                    // Update user
                    this._user.next(updatedUser);

                    return updatedUser;
                })
            ))
        )
    }
}