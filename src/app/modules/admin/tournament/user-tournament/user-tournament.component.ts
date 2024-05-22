import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { PipesModule } from 'app/pipes/pipe.module';
import { Pagination } from 'app/types/pagination.type';
import { UserTournament } from 'app/types/user-tournament.type';
import { Observable, Subject, takeUntil } from 'rxjs';
import { UserTournamentService } from './user-tournament.service';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-user-tournament',
    templateUrl: 'user-tournament.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule,
        ReactiveFormsModule, MatInputModule, MatSortModule, MatPaginatorModule, PipesModule,
        MatSelectModule, MatOptionModule, MatMenuModule
    ]
})

export class UserTournamentComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    id: string;
    userTournaments$: Observable<UserTournament[]>;
    status: string;
    query: string;

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    pagination: Pagination;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userTournamentService: UserTournamentService,
        private _changeDetectorRef: ChangeDetectorRef,
        public matDialogRef: MatDialogRef<UserTournamentComponent>,
        private _dialog: MatDialog
    ) { }

    ngOnInit() {
        // Get the products
        this.userTournaments$ = this._userTournamentService.userTournaments$;

        this._userTournamentService.userTournaments$.subscribe(a => {
            console.log(a);
        });

        // Get the pagination
        this._userTournamentService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
 * After view init
 */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Detect changes
            this._changeDetectorRef.detectChanges();
        }
    }
}
