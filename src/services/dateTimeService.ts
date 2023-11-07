import 'moment-timezone';
import moment from 'moment';

export function formatDate(date: Date) {
    return moment(date).format('DD/MM/YYYY');
}

export function formatDateTime(date: Date): string {

    const momentTz = moment;


    const userTimezone = momentTz.tz.guess();


    return momentTz(date).tz(userTimezone).format('DD/MM/YYYY HH:mm:ss');
}

export function addMonthsFormat(dateStr: string, months: number): string {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months)

    const momentTz = moment;


    const userTimezone = momentTz.tz.guess();


    return momentTz(date).tz(userTimezone).format('DD/MM/YYYY');
}
