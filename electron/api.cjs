// import { getPeople } from "./models/people.js";

// export default {
//     getPeople: getPeople,
// }
// convert to commonjs

const people = require("./models/people.cjs");
const person = require("./models/person.cjs");
const photo_info = require("./models/photo_info.cjs");

module.exports = {
    getPeople: people.getPeople,
    getPeopleTime: people.getPeopleTime,
    getPersonStat: person.getPersonStat,
    getPersonStatNameAgnostic: photo_info.getPersonStatNameAgnostic,
    getDailyZeroedCounts: person.getDailyZeroedCounts,
    getDailyZeroedCountsNameAgnostic: photo_info.getDailyZeroedCountsNameAgnostic,
    getCurationScore: person.getCurationScore,
}