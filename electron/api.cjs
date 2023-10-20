// import { getPeople } from "./models/people.js";

// export default {
//     getPeople: getPeople,
// }
// convert to commonjs

const people = require("./models/people.cjs");
const person = require("./models/person.cjs");
const photo_info = require("./models/photo_info.cjs");
const dispatcher = require("./models/dispatcher.cjs");
module.exports = {
    // getPeople: people.getPeople,
    getPeople: dispatcher.getPeople,
    getPeopleTime: people.getPeopleTime,
    getPersonStat: dispatcher.getPersonStat,
    getDailyZeroedCounts: dispatcher.getDailyZeroedCounts,
    // getPersonStat: person.getPersonStat,
    // getPersonStatNameAgnostic: photo_info.getPersonStatNameAgnostic,
    // getDailyZeroedCounts: person.getDailyZeroedCounts,
    // getDailyZeroedCountsNameAgnostic: photo_info.getDailyZeroedCountsNameAgnostic,
    getCurationScore: person.getCurationScore,
    getNumericScoresTime: person.getNumericScoresTime,
}