import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { UserService } from './user.service';
import { User } from 'app/core/user/user.types';
import { Pagination } from 'app/types/pagination.type';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PipesModule } from 'app/pipes/pipe.module';
import { jsonToFormData } from 'app/extensions/form-data-extentions';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
    selector: 'app-user',
    templateUrl: 'user.component.html',
    styleUrls: ['user.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSortModule, MatPaginatorModule,
        PipesModule, MatSelectModule, MatOptionModule
    ]
})

export class UserComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    users$: Observable<User[]>;
    query: string;
    status: string;

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    pagination: Pagination;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _dialog: MatDialog
    ) { }

    ngOnInit() {
        // Get the products
        this.users$ = this._userService.users$;

        // Get the pagination
        this._userService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Search input value change
        this.subscribeSearchInput();
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

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.isLoading = true;
                    return this._userService.getUsers(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction, this.searchInputControl.value);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    subscribeSearchInput() {
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.query = query;
                    this.isLoading = true;
                    return this._userService.getUsers(0, 10, 'name', 'asc', this.query, this.status);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
    }

    onStatusFilterChanged(event: any) {
        this.status = event.value;
        return this._userService.getUsers(0, 10, 'name', 'asc', this.query, this.status).subscribe();
    }

    onBlockGroupClicked(id: string) {
        this._fuseConfirmationService.open().afterClosed().subscribe(result => {
            if (result == 'confirmed') {
                var data = jsonToFormData({ status: 'Blocked' });
                this._userService.updateUser(id, data).subscribe();
            }
        })
    }

    onUnBlockGroupClicked(id: string) {
        this._fuseConfirmationService.open().afterClosed().subscribe(result => {
            if (result == 'confirmed') {
                var data = jsonToFormData({ status: 'Active' });
                this._userService.updateUser(id, data).subscribe();
            }
        })
    }

    private showFlashMessage(type: 'success' | 'error', message: string, time: number): void {
        this.flashMessage = type;
        this.message = message;
        this._changeDetectorRef.markForCheck();
        setTimeout(() => {
            this.flashMessage = this.message = null;
            this._changeDetectorRef.markForCheck();
        }, time);
    }
}