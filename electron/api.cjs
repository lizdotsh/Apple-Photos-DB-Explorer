// import { getPeople } from "./models/people.js";

// export default {
//     getPeople: getPeople,
// }
// convert to commonjs

const people = require("./models/people.cjs");
const person = require("./models/person.cjs");

module.exports = {
    getPeople: people.getPeople,
    getPeopleTime: people.getPeopleTime,
    getPersonStat: person.getPersonStat,
    getDailyZeroedCounts: person.getDailyZeroedCounts,
    getCurationScore: person.getCurationScore,
}