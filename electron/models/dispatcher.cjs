const person = require("./person.cjs");
const photo_info = require("./photo_info.cjs");
const people = require("./people.cjs");
const { arr_reduce } = require("./db_utils.cjs");
exports.getPersonStat = (person_id, start_date, end_date, stats) => {
    if (person_id === "---") {
        return photo_info.getPersonStatNameAgnostic(start_date, end_date, stats);
    }
    return person.getPersonStat(person_id, start_date, end_date, stats);
}

exports.getDailyZeroedCounts = (person_id) => {
    if (person_id === "---") {
        return photo_info.getDailyZeroedCountsNameAgnostic();
    }
    return person.getDailyZeroedCounts(person_id);
}

exports.getPeople = ( ) => {
    return arr_reduce([
        ...people.getPeople(),
        photo_info.getTotal()
    ], "person_uuid");
}