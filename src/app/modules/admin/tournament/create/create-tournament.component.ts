import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { GoogleMapsModule } from '@angular/google-maps'

@Component({
    selector: 'app-create-tournament',
    templateUrl: 'create-tournament.component.html',
    styleUrls: ['create-tournament.component.css'],
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatPaginatorModule, MatSortModule,
        MatSelectModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatStepperModule, GoogleMapsModule]
})

export class CreateTournamentComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    imageUrl: string;

    center: google.maps.LatLngLiteral;

    createTournamentForm: UntypedFormGroup;
    positionForm: UntypedFormGroup;
    thumbnailForm: UntypedFormGroup;

    constructor(
        private _tournamentServive: TournamentService,
        public matDialogRef: MatDialogRef<CreateTournamentComponent>,
        private _formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit() {
        this.initCreateTournamentForm();
        this.initPositionForm();
        this.initThumbnailForm();
        this.setDefaultPosition();
    }

    private initCreateTournamentForm() {
        this.createTournamentForm = this._formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            rule: ['', [Validators.required]],
            maximumMember: [''],
            distance: ['', Validators.required],
            registerDuration: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            address: ['', [Validators.required]],
        });
    }

    private initPositionForm() {
        this.positionForm = this._formBuilder.group({
            longitude: ['', [Validators.required]],
            latitude: ['', [Validators.required]],
        });
    }

    private initThumbnailForm() {
        this.thumbnailForm = this._formBuilder.group({
            thumbnail: [[Validators.required]],
        });
    }

    public createTournament() {
        if (this.createTournamentForm.valid) {
            this._tournamentServive.createTournament(this.createTournamentForm.value).subscribe(result => {
                if (result) {
                    this.matDialogRef.close('success');
                } else {
                    this.matDialogRef.close('error');
                }
            })
        }
    }

    selectFile() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event) {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.imageUrl = reader.result as string;
            };
        }
    }

    setDefaultPosition() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });
    }
}