import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { TournamentService } from '../tournament.service';
import { Tournament } from 'app/types/tournament.type';
import { FuseCardComponent } from '@fuse/components/card';
import { CommonModule } from '@angular/common';
import { PipesModule } from 'app/pipes/pipe.module';

@Component({
    selector: 'app-tournament-detail',
    templateUrl: 'tournament-detail.component.html',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatPaginatorModule, MatSortModule,
        MatSelectModule, MatDialogModule, MatAutocompleteModule, MatDatepickerModule, MatStepperModule, GoogleMapsModule, FuseCardComponent, PipesModule]
})

export class TournamentDetailComponent implements OnInit {

    tournament: Tournament;

    center: google.maps.LatLngLiteral;
    zoom = 12;
    marker: any = [];
    autocomplete: google.maps.places.Autocomplete;
    options: google.maps.MapOptions = {
    };

    constructor(
        private _tournamentService: TournamentService,
        public matDialogRef: MatDialogRef<TournamentDetailComponent>,
    ) { }

    ngOnInit() {
        this._tournamentService.tournament$.subscribe(tournament => {
            this.tournament = tournament;
            this.center = {
                lat: tournament.latitude,
                lng: tournament.longitude
            };
            this.addMarker();
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