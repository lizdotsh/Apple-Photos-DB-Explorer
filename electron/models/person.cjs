const { db, txGetAll, txManyArr, arr_reduce, txGetOne } = require("./db_utils.cjs");


exports.getPersonStat = function(person_id, start_date, end_date, stats) {
    let result = {};
    // console.log(stats)
    db.transaction(() => {
        //result = {};
        for (let stat of stats) {
            // I know this is horribly unsafe, im just lazy. 
            const query = `
            with count_only as (

            select 
            person_uuid,
            full_name,
            ${stat},
            sum(count) as count
            from photo_info_rollup_monthly
            where year_month >= :start_date
            and year_month <= :end_date
            group by 1,2,3 
            having person_uuid = :person_id
            )
            -- unsure about how sqlite will handle this under the hood, breaking it up into two queries.
            select 
            person_uuid,
            full_name,
            ${stat},
            count,
            (100*count)/ sum(count) over (partition by person_uuid) as pct
            from count_only
            order by count desc;
            `
            result[stat] = db.prepare(query).all({person_id, start_date, end_date});
        }
    })();
    
    return result;
}; 
// function composeStats(stats) {
//     return stats.map((stat) => {
//         return `select person_uuid, full_name, '${stat}' as stat, ${stat} as value, sum(count) as count
//         from photo_info_rollup_monthly
//         where year_month >= :start_date
//         and year_month <= :end_date
//         and person_uuid = :person_id
//         group by 1,2,3
//         order by count desc`;
// }).join("\nunion all\n");
// }
// exports.getPersonStatFast = function(person_id, start_date, end_date, stats) {
//     const query = `{with count_only as (
//         ${composeStats(stats)}
//     )
//     select
//     person_uuid,
//     full_name,
//     ${stats.join(",")}
//     `;

exports.getDailyZeroedCountsQuery = function() {
    return `
    with cnt as (
    select 
    photos_per_user_daily.person_uuid as person_uuid,
    date_series.date as date,
    sum(ifnull(photos_per_user_daily.count, 0)) as count,
    sum(ifnull(photos_per_user_daily.front_camera_count, 0)) as front_camera_count
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
    front_camera_count,
    sum(count) OVER (
        ORDER BY date
        ROWS BETWEEN 7 PRECEDING AND current row 
    ) as seven_day_sum,
  
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
    
}

function composeScores(scores) {
    return scores.map((score) => {
        return `select person_uuid, 
        '${score.name}' as score,
        avg(${score.name}) as value
        from photo_info where person_uuid = :person_id 
        and date_created >= :start_date and date_created <= :end_date
        group by person_uuid`;
}).join("\nunion all\n");
}

function composeScoresOneQuery(scores) {
    return `select 
    person_uuid,
    ${scores.map(score => `avg(${score.name}) as ${score.alias}`).join(",\n")}
    from photo_info where person_uuid = :person_id
    and date_created >= :start_date and date_created <= :end_date
    group by person_uuid`;

}
exports.getCurationScore = function(person_id, start_date, end_date) {
    const query_old = `select
    person_uuid,
    avg(curation_score) as curation_score
    from photo_info where person_uuid = :person_id
    and date_created >= :start_date and date_created <= :end_date
    group by person_uuid`;
  //  const query = composeScores(numeric_scores_as_arr_of_objects)
  const query = composeScoresOneQuery(numeric_scores_as_arr_of_objects);
    console.log(query);
    dict = {};
    res = txGetOne(query, {person_id, start_date, end_date});
   // res.forEach((row) => {
    //    dict[row.score] = row.value;
//        return;
  //  });
    return res;
}
// exports.getNumericPersonStats = function(person_id, start_date, end_date) {
//     const query = `
//     select
   
//   `
// }
exports.getNumericScoresTime = function(person_id, start_date, end_date) {
    query = `
    with total as (select sum(count) as tot
    from numeric_scores_monthly
    where person_uuid = :person_id
    and year_month >= :start_date
    and year_month <= :end_date
    )
    select 
    ${numeric_scores_as_arr_of_objects.map(score => `sum(${score.alias}) / total.tot as ${score.alias}`).join(",\n")}
    from numeric_scores_monthly n 
    left join total on 1 = 1
    where person_uuid = :person_id
    and year_month >= :start_date
    and year_month <= :end_date
    group by person_uuid
    `;
    return txGetOne(query, {person_id, start_date, end_date});
}

// const numeric_scores =  {
//     "curation_score": "curation_score",
//     "zm_activity_score": "activity_score",
//     "zm_video_score": "video_score",
//     "zm_audio_score": "audio_score",
//     "zm_wallpaper_score": "wallpaper_score",
//     "zm_autoplay_suggestion_score": "autoplay_suggestion_score",
//     "zm_blurriness_score": "blurriness_score",
//     "zm_exposure_score": "exposure_score",
//     "zc_behavioral_score": "behavioral_score",
//     "zc_failure_score": "failure_score",
//     "zc_harmonious_color_score": "harmonious_color_score",
//     "zc_immersiveness_score": "immersiveness_score",
//     "zc_interaction_score": "interaction_score",
//     "zc_interesting_subject_score": "interesting_subject_score",
//     "zc_intrusive_object_presence_score": "intrusive_object_presence_score",
//     "zc_lively_color_score": "lively_color_score",
//     "zc_low_light": "low_light",
//     "zc_noise_score": "noise_score",
//     "zc_pleasant_camera_tilt_score": "pleasant_camera_tilt_score",
//     "zc_pleasant_composition_score": "pleasant_composition_score",
//     "zc_pleasant_lighting_score": "pleasant_lighting_score",
//     "zc_pleasant_pattern_score": "pleasant_pattern_score",
//     "zc_pleasant_perspective_score": "pleasant_perspective_score",
//     "zc_pleasant_post_processing_score": "pleasant_post_processing_score",
//     "zc_pleasant_reflection_score": "pleasant_reflection_score",
//     "zc_pleasant_symmetry_score": "pleasant_symmetry_score",
//     "zc_sharply_focused_subject_score": "sharply_focused_subject_score",
//     "zc_tastefully_blurred_score": "tastefully_blurred_score",
//     "zc_well_chosen_subject_score": "well_chosen_subject_score",
//     "zc_well_framed_subject_score": "well_framed_subject_score",
//     "zc_well_timed_shot_score": "well_timed_shot_score"
// };

const numeric_scores_as_arr_of_objects = [
    {name: "curation_score", alias: "curation_score"},
    {name: "zm_activity_score", alias: "activity_score"},
    {name: "zm_video_score", alias: "video_score"},
    {name: "zm_audio_score", alias: "audio_score"},
    {name: "zm_wallpaper_score", alias: "wallpaper_score"},
    {name: "zm_autoplay_suggestion_score", alias: "autoplay_suggestion_score"},
    {name: "zm_blurriness_score", alias: "blurriness_score"},
    {name: "zm_exposure_score", alias: "exposure_score"},
    {name: "zc_behavioral_score", alias: "behavioral_score"},
    {name: "zc_failure_score", alias: "failure_score"},
    {name: "zc_harmonious_color_score", alias: "harmonious_color_score"},
    {name: "zc_immersiveness_score", alias: "immersiveness_score"},
    {name: "zc_interaction_score", alias: "interaction_score"},
    {name: "zc_interesting_subject_score", alias: "interesting_subject_score"},
    {name: "zc_intrusive_object_presence_score", alias: "intrusive_object_presence_score"},
    {name: "zc_lively_color_score", alias: "lively_color_score"},
    {name: "zc_low_light", alias: "low_light"},
    {name: "zc_noise_score", alias: "noise_score"},
    {name: "zc_pleasant_camera_tilt_score", alias: "pleasant_camera_tilt_score"},
    {name: "zc_pleasant_composition_score", alias: "pleasant_composition_score"},
    {name: "zc_pleasant_lighting_score", alias: "pleasant_lighting_score"},
    {name: "zc_pleasant_pattern_score", alias: "pleasant_pattern_score"},
    {name: "zc_pleasant_perspective_score", alias: "pleasant_perspective_score"},
    {name: "zc_pleasant_post_processing_score", alias: "pleasant_post_processing_score"},
    {name: "zc_pleasant_reflection_score", alias: "pleasant_reflection_score"},
    {name: "zc_pleasant_symmetry_score", alias: "pleasant_symmetry_score"},
    {name: "zc_sharply_focused_subject_score", alias: "sharply_focused_subject_score"},
    {name: "zc_tastefully_blurred_score", alias: "tastefully_blurred_score"},
    {name: "zc_well_chosen_subject_score", alias: "well_chosen_subject_score"},
    {name: "zc_well_framed_subject_score", alias: "well_framed_subject_score"},
    {name: "zc_well_timed_shot_score", alias: "well_timed_shot_score"}
]