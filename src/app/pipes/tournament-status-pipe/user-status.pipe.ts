import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {

    transform(status: string): string {
        if (status === 'Active') {
            return '<span class="bg-green-200 text-green-800 me-2 px-2.5 py-1 rounded dark:bg-green-900 dark:text-green-300">Active</span>';
        } else if (status === 'Blocked') {
            return '<span class="bg-red-200 text-red-800 me-2 px-2.5 py-1 rounded dark:bg-red-900 dark:text-red-300">Blocked</span>';
        } else {
            return '<span class="bg-yellow-200 text-yellow-800 me-2 px-2.5 py-1 rounded dark:bg-yellow-900 dark:text-yellow-300">Unknown</span>';
        }
    }

}
