const { db, txGetOne } = require("./db_utils.cjs");


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
            and person_uuid = :person_id
            group by 1,2,3 
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
        ) as seven_day_sum
    from cnt)

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

exports.getNumericScoresTime = function(person_id, start_date, end_date) {
    query = `
    with total as (select sum(count) as tot
    from numeric_scores_monthly
    where person_uuid = :person_id
    and year_month >= :start_date
    and year_month <= :end_date
    )
    select 
    ${numeric_scores_as_arr_of_objects.map(score => {
        if (score.adjust) {
            return `50 + (50 * (sum(${score.alias}) / total.tot)) as '${score.cleaned_alias}'`
        }
        return `100 * (sum(${score.alias}) / total.tot) as '${score.cleaned_alias}'`
    }).join(",\n")}
    from numeric_scores_monthly n 
    left join total on 1 = 1
    where person_uuid = :person_id
    and year_month >= :start_date
    and year_month <= :end_date
    group by person_uuid
    `;
    return txGetOne(query, {person_id, start_date, end_date});
}

const numeric_scores_as_arr_of_objects = [
    {name: "curation_score", alias: "curation_score", cleaned_alias: "Overall Score"},
    {name: "zm_activity_score", alias: "activity_score", adjust: false, cleaned_alias: "Activity Score"},
    {name: "zm_video_score", alias: "video_score", adjust: false, cleaned_alias: "Video Score"},
    {name: "zm_audio_score", alias: "audio_score", adjust: false, cleaned_alias: "Audio Score"},
    {name: "zm_wallpaper_score", alias: "wallpaper_score", adjust: false, cleaned_alias: "Wallpaper Score"},
    {name: "zm_autoplay_suggestion_score", alias: "autoplay_suggestion_score", adjust: false, cleaned_alias: "Autoplay Suggestion Score"},
    {name: "zm_blurriness_score", alias: "blurriness_score", adjust: false, cleaned_alias: "Blurriness Score"},
    {name: "zm_exposure_score", alias: "exposure_score", adjust: false, cleaned_alias: "Exposure Score"},
    {name: "zc_behavioral_score", alias: "behavioral_score", adjust: true, cleaned_alias: "Behavioral Score"},
    {name: "zc_failure_score", alias: "failure_score", adjust: true, cleaned_alias: "Failure Score"},
    {name: "zc_harmonious_color_score", alias: "harmonious_color_score", adjust: true, cleaned_alias: "Harmonious Color Score"},
    {name: "zc_immersiveness_score", alias: "immersiveness_score", adjust: true, cleaned_alias: "Immersiveness Score"},
    {name: "zc_interaction_score", alias: "interaction_score", adjust: true, cleaned_alias: "Interaction Score"},
    {name: "zc_interesting_subject_score", alias: "interesting_subject_score", adjust: true, cleaned_alias: "Interesting Subject Score"},
    {name: "zc_intrusive_object_presence_score", alias: "intrusive_object_presence_score", adjust: true, cleaned_alias: "Intrusive Object Presence Score"},
    {name: "zc_lively_color_score", alias: "lively_color_score", adjust: true, cleaned_alias: "Lively Color Score"},
    {name: "zc_low_light", alias: "low_light", adjust: true, cleaned_alias: "Low Light"},
    {name: "zc_noise_score", alias: "noise_score", adjust: true, cleaned_alias: "Noise Score"},
    {name: "zc_pleasant_camera_tilt_score", alias: "pleasant_camera_tilt_score", adjust: true, cleaned_alias: "Pleasant Camera Tilt Score"},
    {name: "zc_pleasant_composition_score", alias: "pleasant_composition_score", adjust: true, cleaned_alias: "Pleasant Composition Score"},
    {name: "zc_pleasant_lighting_score", alias: "pleasant_lighting_score", adjust: true, cleaned_alias: "Pleasant Lighting Score"},
    {name: "zc_pleasant_pattern_score", alias: "pleasant_pattern_score", adjust: true, cleaned_alias: "Pleasant Pattern Score"},
    {name: "zc_pleasant_perspective_score", alias: "pleasant_perspective_score", adjust: true, cleaned_alias: "Pleasant Perspective Score"},
    {name: "zc_pleasant_post_processing_score", alias: "pleasant_post_processing_score", adjust: true, cleaned_alias: "Pleasant Post Processing Score"},
    {name: "zc_pleasant_reflection_score", alias: "pleasant_reflection_score", adjust: true, cleaned_alias: "Pleasant Reflection Score"},
    {name: "zc_pleasant_symmetry_score", alias: "pleasant_symmetry_score", adjust: true, cleaned_alias: "Pleasant Symmetry Score"},
    {name: "zc_sharply_focused_subject_score", alias: "sharply_focused_subject_score", adjust: true, cleaned_alias: "Sharply Focused Subject Score"},
    {name: "zc_tastefully_blurred_score", alias: "tastefully_blurred_score", adjust: true, cleaned_alias: "Tastefully Blurred Score"},
    {name: "zc_well_chosen_subject_score", alias: "well_chosen_subject_score", adjust: true, cleaned_alias: "Well Chosen Subject Score"},
    {name: "zc_well_framed_subject_score", alias: "well_framed_subject_score", adjust: true, cleaned_alias: "Well Framed Subject Score"},
    {name: "zc_well_timed_shot_score", alias: "well_timed_shot_score", adjust: true, cleaned_alias: "Well Timed Shot Score"},
]