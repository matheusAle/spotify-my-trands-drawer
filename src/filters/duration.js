import * as moment from 'moment';



export default function duration(value, unit) {
    const duration = moment.duration(value, unit);
    return `${duration.minutes()}:${duration.seconds()}`
}
