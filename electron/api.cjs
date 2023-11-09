const people = require("./models/people.cjs");
const person = require("./models/person.cjs");
const dispatcher = require("./models/dispatcher.cjs");
module.exports = {
    // getPeople: people.getPeople,
    getPeople: dispatcher.getPeople,
    getPeopleTime: people.getPeopleTime,
    getPersonStat: dispatcher.getPersonStat,
    getDailyZeroedCounts: dispatcher.getDailyZeroedCounts,
    getCurationScore: person.getCurationScore,
    getNumericScoresTime: person.getNumericScoresTime,
};
