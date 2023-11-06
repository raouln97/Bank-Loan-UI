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
