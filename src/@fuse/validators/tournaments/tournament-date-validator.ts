import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const registerDate = new Date(group.get('registerDuration')?.value);
        const startDate = new Date(group.get('startTime')?.value);
        const endDate = new Date(group.get('endTime')?.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!registerDate || !startDate || !endDate) {
            return null;
        }

        if (registerDate <= new Date(today.setDate(today.getDate() + 3))) {
            return { 'invalidRegisterDate': true };
        }

        if (startDate <= new Date(registerDate.setDate(registerDate.getDate() + 3))) {
            return { 'invalidStartDate': true };
        }

        if (endDate < startDate) {
            return { 'invalidEndDate': true };
        }

        return null;
    };
}
