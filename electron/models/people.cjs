// import { db, dbGetAll, arr_reduce } from "./db_utils.js";

// export function getPeople() {
//     const query = `
//             select person_uuid,
//             full_name,
//             sum(count) as count,
//             max(date) as end_date,
//             min(date) as start_date
//             from photo_info_rollup_daily
//             where person_uuid != "no_person"
//             and full_name != "no_name"
//             and full_name != "no_face"
//             group by 1,2 order by count desc
//             `
//   return arr_reduce(dbGetAll(query, []), person_uuid);
// }

const { db, txGetAll, arr_reduce } = require("./db_utils.cjs");

exports.getPeople = function () {
  const query = `
    select 
    person_uuid, 
    full_name, 
    sum(count) as count,
    max(date) as end_date, 
    min(date) as start_date
  from people_sum_daily
    group by 1,2
  order by count desc;


            `;
//   console.log(query);
  return txGetAll(query, []);
};



exports.getPeopleTime = function (start_date, end_date){
    const query = `
      select 
      person_uuid, 
      full_name,
      sum(count) as count
      from people_sum
      where year_month between :start_date and :end_date
      group by 1,2
      order by count desc;
              `;
        const query2 = `        `
    return txGetAll(query, {start_date, end_date});
  };
