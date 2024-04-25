import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { GoogleMap, GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';

@Component({
    selector: 'app-create-tournament',
    templateUrl: 'create-tournament.component.html',
    styleUrls: ['create-tournament.component.css'],
    standalone: true,
    imports: [MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatPaginatorModule, MatSortModule,
        MatSelectModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatStepperModule, GoogleMapsModule]
})

export class CreateTournamentComponent implements OnInit, AfterViewInit {
    @ViewChild('fileInput') fileInput: any;
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
    @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;
    @ViewChild('addressInput') addressInput: ElementRef;

    imageUrl: string;
    imageFile: File;

    createTournamentForm: UntypedFormGroup;
    positionForm: UntypedFormGroup;
    thumbnailForm: UntypedFormGroup;

    zoom = 12;
    center: google.maps.LatLngLiteral = { lat: 10.8735551, lng: 106.7679267 };
    marker: any = [];
    autocomplete: google.maps.places.Autocomplete;
    options: google.maps.MapOptions = {
    };

    constructor(
        private _tournamentServive: TournamentService,
        public matDialogRef: MatDialogRef<CreateTournamentComponent>,
        private _formBuilder: UntypedFormBuilder,
    ) { }

    ngOnInit() {
        this.initCreateTournamentForm();
        this.initPositionForm();
        this.initThumbnailForm();
    }

    ngAfterViewInit() {
        this.autocomplete = new google.maps.places.Autocomplete(
            this.addressInput.nativeElement, { types: ['geocode'] }
        );
        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (!place.geometry) {
                // Nếu không tìm thấy geometry cho địa điểm được chọn
                return;
            }

            // Lấy lat và lng từ geometry
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            this.center = {
                lat: lat,
                lng: lng
            };
            this.addMarker();
        });
    }

    private initCreateTournamentForm() {
        this.createTournamentForm = this._formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            rule: ['', [Validators.required]],
            maximumMember: [''],
            distance: ['', Validators.required],
            fee: [0, Validators.required],
            registerDuration: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            address: ['', [Validators.required]],
            longitude: ['', [Validators.required]],
            latitude: ['', [Validators.required]],
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

    selectFile() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event) {
        this.imageFile = event.target.files[0];
        if (this.imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(this.imageFile);
            reader.onload = () => {
                this.imageUrl = reader.result as string;
            };
        }
    }

    mapClick(event: google.maps.KmlMouseEvent) {
        this.center = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        this.createTournamentForm.controls['longitude'].setValue(event.latLng.lng());
        this.createTournamentForm.controls['latitude'].setValue(event.latLng.lat());
        this.addMarker();
    }

    onAutocompleteSelected(place: google.maps.places.PlaceResult) {
        // Ví dụ: di chuyển bản đồ đến địa điểm được chọn
        this.center = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    }

    createTournament() {
        const formData = new FormData();
        var formGroup = this.createTournamentForm;

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            if (control) {
                formData.append(key, control.value);
            }
        });
        formData.append('thumbnail', this.imageFile);
        this._tournamentServive.createTournament(formData).subscribe(result => {
            if (result) {
                this.matDialogRef.close()
            }
        });
    }

    addMarker() {
        this.marker = {
            position: {
                lat: this.center.lat,
                lng: this.center.lng,
            },
            label: {
                color: 'red',
            },
            options: { animation: google.maps.Animation.BOUNCE },
        }
    }
}