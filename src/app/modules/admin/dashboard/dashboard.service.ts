import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dashboard } from 'app/types/dashboard.type';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private _data: BehaviorSubject<Dashboard | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }


    /**
 * Getter for data
 */
    get data$(): Observable<Dashboard> {
        return this._data.asObservable();
    }

    /**
 * Get dashboard
 *
 *
 */
    getDashboards():
        Observable<Dashboard> {
        return this._httpClient.get<Dashboard>('/api/dashboards').pipe(
            tap((response) => {
                this._data.next(response);
            }),
        );
    }
}