import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TournamentService } from '../tournament.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { GoogleMap, GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';
import { dateValidator } from '@fuse/validators/tournaments/tournament-date-validator';
import { Tournament } from 'app/types/tournament.type';

@Component({
    selector: 'app-update-tournament',
    templateUrl: 'update-tournament.component.html',
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatPaginatorModule, MatSortModule,
        MatSelectModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatStepperModule, GoogleMapsModule]
})

export class UpdateTournamentComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
    @ViewChild('addressInput') addressInput: ElementRef;

    imageUrl: string;
    imageFile: File;

    updateTournamentForm: UntypedFormGroup;

    constructor(
        private _tournamentServive: TournamentService,
        public matDialogRef: MatDialogRef<UpdateTournamentComponent>,
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<UpdateTournamentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Tournament
    ) { }

    ngOnInit() {
        this.initUpdateTournamentForm();
    }

    private initUpdateTournamentForm() {
        this.updateTournamentForm = this._formBuilder.group({
            title: [this.data.title, [Validators.required]],
            description: [this.data.description, [Validators.required]],
            maximumMember: [this.data.maximumMember],
            registerDuration: [this.data.registerDuration, Validators.required],
            startTime: [this.data.startTime, Validators.required],
            endTime: [this.data.endTime, Validators.required],
            minAge: [this.data.minAge, [Validators.required]],
            maxAge: [this.data.maxAge, [Validators.required]],
            gender: [this.data.gender, [Validators.required]],
        }, { validators: dateValidator() });
    }

    onGenderChanged(event: any) {
        console.log(event);
        this.updateTournamentForm.controls['gender'].setValue(event.value);
    }

    updateTournament() {
        console.log(this.updateTournamentForm.value);
        console.log(this.updateTournamentForm.valid);

        const formData = new FormData();
        var formGroup = this.updateTournamentForm;

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control) {
                formData.append(key, control.value);
            }
        });

        if (this.updateTournamentForm.valid) {
            this._tournamentServive.updateTournament(this.data.id, formData).subscribe(result => {
                if (result) {
                    this.matDialogRef.close('success')
                }
            }, error => {
                this.matDialogRef.close(error)
            });
        }
    }

}