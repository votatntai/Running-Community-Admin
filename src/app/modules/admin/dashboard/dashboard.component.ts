import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Dashboard } from 'app/types/dashboard.type';
import { DashboardService } from './dashboard.service';

@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

    dashboard: Dashboard;
    /**
     * Constructor
     */
    constructor(private _dashboardService: DashboardService) {
        _dashboardService.data$.subscribe(dashboard => {
            this.dashboard = dashboard;
        })
    }

    ngOnInit(): void {
    }

}
