const { db, txGetAll, txManyArr, arr_reduce } = require("./db_utils.cjs");


exports.getPersonStat = function(person_id, start_date, end_date, stats) {
    let result = {};
    // console.log(stats)
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

exports.getDailyZeroedCounts = function(person_id) {
    if (!person_id) {
        return undefined;
    }
    const query = `
    with cnt as (
    select 
    photos_per_user_daily.person_uuid as person_uuid,
    date_series.date as date,
    sum(ifnull(photos_per_user_daily.count, 0)) as count

    from date_series 
    left join photos_per_user_daily on date_series.date = photos_per_user_daily.date 
    and photos_per_user_daily.person_uuid = :person_id
    where date_series.date >= (select min(date) from photos_per_user_daily where person_uuid = :person_id)
    and date_series.date <= (select max(date) from photos_per_user_daily where person_uuid = :person_id)
    group by 1,2
    order by date_series.date
    ),
    -- I know this is horribly inefficient lmao
    seven as (
    select 
    date,
    count,
    sum(count) OVER (
        ORDER BY date
        ROWS BETWEEN 7 PRECEDING AND current row 
    ) as seven_day_sum
    from cnt
    )
    select 
    :person_id as person_uuid,
    date, 
    count, 
    seven_day_sum,
    AVG(seven_day_sum) OVER (
        ORDER BY date
        ROWS BETWEEN 30 PRECEDING AND current row 
    ) as 'thirty_day_rolling',
    AVG(seven_day_sum) OVER (
        ORDER BY date
        ROWS BETWEEN 90 PRECEDING AND current row 
    ) as 'ninety_day_rolling'
    from seven;
    `;
    return txGetAll(query, {person_id});
}