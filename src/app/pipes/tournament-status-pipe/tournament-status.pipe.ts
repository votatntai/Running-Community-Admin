import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tournamentStatus'
})
export class TournamentStatusPipe implements PipeTransform {

    transform(startTime: string, endTime: string): string {
        const currentDate = new Date();
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (currentDate >= startDate && currentDate <= endDate) {
            return '<span class="bg-green-200 text-green-800 me-2 px-2.5 py-1 rounded dark:bg-green-900 dark:text-green-300">Happening</span>';
        } else if (currentDate > endDate) {
            return '<span class="bg-red-200 text-red-800 me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-red-300">Finished</span>';
        } else {
            return '<span class="bg-yellow-200 text-yellow-800 me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-yellow-300">Not Happen</span>';
        }
    }

}
