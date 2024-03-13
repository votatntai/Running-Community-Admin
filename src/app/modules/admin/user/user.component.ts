import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'user',
    standalone: true,
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule]
})
export class UserComponent {
    /**
     * Constructor
     */
    constructor() {
    }

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    // users$: Observable<User[]>;

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    // pagination: Pagination;
}
