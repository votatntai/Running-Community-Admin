import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

    /**
     * Constructor
     */
    constructor() {
    }

    ngOnInit(): void {
    }

}
