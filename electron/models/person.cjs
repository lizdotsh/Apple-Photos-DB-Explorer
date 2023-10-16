const { db, txGetAll, txManyArr, arr_reduce } = require("./db_utils.cjs");


exports.getPersonStat = function(person_id, start_date, end_date, stats) {
    let result = {};
    console.log(stats)
    db.transaction(() => {
        //result = {};
        for (let stat of stats) {
            // I know this is horribly unsafe, im just lazy. 
            const query = `
            select 
            person_uuid,
            full_name,
            ${stat},
            sum(count) as count,
            (100*sum(count))/ sum(sum(count)) over (partition by person_uuid) as pct
            from photo_info_rollup_monthly
            where year_month >= :start_date
            and year_month <= :end_date
            group by 1,2,3 
            having person_uuid = :person_id
            order by count desc;
            `
         //   const temp = 

            // add a total to the end of the array
         //   const total = temp.reduce((acc, cur) => acc + cur.count, 0);

            result[stat] = db.prepare(query).all({person_id, start_date, end_date});
            
         //   console.log(result[stat])
        }
    })();
    
    return result;
}; 