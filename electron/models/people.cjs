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
  from photo_info_rollup_daily 
  where person_uuid != 'no_person'
    and full_name != 'no_name'
    and full_name != 'no_face' 
  group by 1,2 order by count desc;
            `;
//   console.log(query);
  return arr_reduce(txGetAll(query, []), "person_uuid");
};



exports.getPeopleTime = function (start_date, end_date){
    const query = `
      select 
      person_uuid, 
      full_name,
      sum(count) as count
      from people_cumsum
      --where full_name != 'no_name'
      --and full_name != 'no_face'
      where year_month between ? and ? 
      group by 1,2 order by count desc;
              `;

    return (txGetAll(query, [start_date, end_date]));
  };
  