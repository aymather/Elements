// Takes a moment and formats it to the display text for UI
const moment = require('moment');

module.exports = formatMoment = date => {
    var mlist = [ "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
    var date = new moment(date);
    var month = mlist[date.get('month')];
    var year = date.get('year');
    var day = date.get('date');
    return `${month} ${day}, ${year}`.toUpperCase();
}