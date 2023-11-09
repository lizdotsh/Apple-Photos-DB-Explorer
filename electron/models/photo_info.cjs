// Like person, but disaggregated to work without selecting a person

const { db, txGetAll, txGetOne } = require("./db_utils.cjs");

exports.getDailyZeroedCountsNameAgnosticQuery = function () {
    return `
    with cnt as (
    select 
    date_series.date as date,
    sum(ifnull(photos_per_user_daily.count, 0)) as count,
    sum(ifnull(photos_per_user_daily.front_camera_count, 0)) as front_camera_count
    from date_series 
    left join photos_per_user_daily on date_series.date = photos_per_user_daily.date 
    where date_series.date >= (select min(date) from photos_per_user_daily)
    and date_series.date <= (select max(date) from photos_per_user_daily)
    group by 1
    order by date_series.date
    ),
    -- I know this is horribly inefficient lmao
    seven as (
    select 
    date,
    count,
    front_camera_count,
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
    front_camera_count,
    seven_day_sum,
    AVG(seven_day_sum) OVER (
        ORDER BY date
        ROWS BETWEEN 30 PRECEDING AND current row 
    ) as 'thirty_day_rolling_week',
  
    AVG(seven_day_sum) OVER (
        ORDER BY date
        ROWS BETWEEN 90 PRECEDING AND current row 
    ) as 'ninety_day_rolling_week'
    from seven;
    `;
};

exports.getPersonStatNameAgnostic = function (start_date, end_date, stats) {
    let result = {};
    // console.log(stats)
    db.transaction(() => {
        //result = {};
        for (let stat of stats) {
            // I know this is horribly unsafe, im just lazy.
            const query = `
            with count_only as (

            select 
            ${stat},
            sum(count) as count
            from photo_info_rollup_monthly
            where year_month >= :start_date
            and year_month <= :end_date
            group by 1
            )
            -- unsure about how sqlite will handle this under the hood, breaking it up into two queries.
            select 
            ${stat},
            count,
            (100*count)/ sum(count) over () as pct
            from count_only
            order by count desc;
            `;
            result[stat] = db.prepare(query).all({ start_date, end_date });
        }
    })();

    return result;
};

exports.getTotal = function () {
    const query = `
      select 
      '---' as person_uuid,
      'All Photos' as full_name, 
      sum(count) as count,
      max(date) as end_date, 
      min(date) as start_date
    from photo_info_rollup_daily 
    group by 1,2 order by count desc;
              `;
    //   console.log(query);
    return txGetOne(query, []);
};
