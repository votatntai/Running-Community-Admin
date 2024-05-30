import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { jsonToFormData } from 'app/extensions/form-data-extentions';
import { PipesModule } from 'app/pipes/pipe.module';
import { Group } from 'app/types/group.type';
import { Pagination } from 'app/types/pagination.type';
import { Observable, Subject, debounceTime, map, merge, switchMap, takeUntil } from 'rxjs';
import { GroupService } from './group.service';

@Component({
    selector: 'app-group',
    templateUrl: 'group.component.html',
    styleUrls: ['group.component.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSortModule, MatPaginatorModule,
        PipesModule, MatSelectModule, MatOptionModule
    ]
})

export class GroupComponent implements OnInit, AfterViewInit {

    segments = [1, 2, 3, 4, 5, 6];
    isSpinning = false;
    currentDegree = 0;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    groups$: Observable<Group[]>;
    query: string;
    status: string;

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    pagination: Pagination;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _groupService: GroupService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _dialog: MatDialog
    ) { }

    ngOnInit() {
        // Get the products
        this.groups$ = this._groupService.groups$;

        // Get the pagination
        this._groupService.pagination$
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

            // If the group changes the sort order...
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
                    return this._groupService.getGroups(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction, this.searchInputControl.value);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    onBlockGroupClicked(id: string) {
        this._fuseConfirmationService.open().afterClosed().subscribe(result => {
            if (result == 'confirmed') {
                var data = jsonToFormData({ status: 'Blocked' });
                this._groupService.updateGroup(id, data).subscribe();
            }
        })
    }

    onUnBlockGroupClicked(id: string) {
        this._fuseConfirmationService.open().afterClosed().subscribe(result => {
            if (result == 'confirmed') {
                var data = jsonToFormData({ status: 'Active' });
                this._groupService.updateGroup(id, data).subscribe();
            }
        })
    }

    onStatusFilterChanged(event: any) {
        this.status = event.value;
        return this._groupService.getGroups(0, 10, 'name', 'asc', this.query, this.status).subscribe();
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
                    return this._groupService.getGroups(0, 10, 'name', 'asc', this.query, this.status);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
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

    spin() {
        if (this.isSpinning) {
            return;
        }

        this.isSpinning = true;
        const spinDegree = Math.floor(Math.random() * 360) + 720; // Xoay ít nhất 2 vòng
        this.currentDegree += spinDegree;

        setTimeout(() => {
            this.isSpinning = false;
            const actualDegree = this.currentDegree % 360;
            console.log('Final Degree:', actualDegree);
        }, 5000);
    }
}