// import { getPeople } from "./models/people.js";

// export default {
//     getPeople: getPeople,
// }
// convert to commonjs

const people = require("./models/people.cjs");

module.exports = {
    getPeople: people.getPeople,
    getPeopleTime: people.getPeopleTime,
    
}