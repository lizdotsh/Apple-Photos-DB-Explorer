const person = require("./person.cjs");
const photo_info = require("./photo_info.cjs");
const people = require("./people.cjs");
const { txGetAll, arr_reduce } = require("./db_utils.cjs");
exports.getPersonStat = (person_id, start_date, end_date, stats) => {
  if (person_id === "---") {
    return photo_info.getPersonStatNameAgnostic(start_date, end_date, stats);
  }
  return person.getPersonStat(person_id, start_date, end_date, stats);
};

exports.getDailyZeroedCounts = (person_id) => {
  if (!person_id) {
    return undefined;
  }
  const queryBuilder =
    person_id === "---"
      ? photo_info.getDailyZeroedCountsNameAgnosticQuery
      : person.getDailyZeroedCountsQuery;

  return txGetAll(queryBuilder(), { person_id });
};
exports.getPeople = () => {
  return arr_reduce(
    [photo_info.getTotal(), ...people.getPeople()],
    "person_uuid"
  );
};

