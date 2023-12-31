DROP TABLE IF EXISTS photo_info_rollup_daily;

CREATE TABLE photo_info_rollup_daily AS
SELECT
    -- Person uuid but replace null with 'no person'
    COALESCE(person_uuid, 'no_person') AS person_uuid,
    CASE
        WHEN full_name = ''
            THEN 'no_name'
        WHEN full_name IS NULL
            THEN 'no_face'
        ELSE full_name
    END AS full_name,
    -- year-month of the photo. sqlite. 
    -- https://www.sqlite.org/lang_datefunc.html
    strftime('%Y-%m-%d', date_created) AS DATE,
    camera_make,
    camera_model,
    face_count,
    gender_estimate,
    age_estimate,
    ethnicity_estimate,
    skin_tone_estimate,
    facial_hair_estimate,
    face_mask_estimate,
    face_expression_estimate,
    pose_type_estimate,
    smile_estimate,
    smile_type_estimate,
    smile_combined_estimate,
    lip_makeup_estimate,
    winking_estimate,
    glasses_estimate,
    eye_makeup_estimate,
    which_camera,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22;

DROP TABLE IF EXISTS photo_info_rollup_monthly;

CREATE TABLE photo_info_rollup_monthly AS
SELECT
    -- Person uuid but replace null with 'no person'
    COALESCE(person_uuid, 'no_person') AS person_uuid,
    CASE
        WHEN full_name = ''
            THEN 'no_name'
        WHEN full_name IS NULL
            THEN 'no_face'
        ELSE full_name
    END AS full_name,
    -- year-month of the photo. sqlite. 
    -- https://www.sqlite.org/lang_datefunc.html
    strftime('%Y-%m', date_created) || '-01' AS YEAR_MONTH,
    camera_make,
    camera_model,
    face_count,
    gender_estimate,
    age_estimate,
    ethnicity_estimate,
    skin_tone_estimate,
    facial_hair_estimate,
    face_mask_estimate,
    face_expression_estimate,
    pose_type_estimate,
    smile_estimate,
    smile_type_estimate,
    smile_combined_estimate,
    lip_makeup_estimate,
    winking_estimate,
    glasses_estimate,
    eye_makeup_estimate,
    which_camera,
    hair_color_estimate,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
WHERE
    full_name != ''
    AND full_name IS NOT NULL
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22;

CREATE INDEX person_monthly_uuid_index
ON photo_info_rollup_monthly(person_uuid);

CREATE INDEX photo_info_monthly_person_uuid_year_month
ON photo_info_rollup_monthly(YEAR_MONTH);

CREATE INDEX photo_info_monthly_personid_name_date
ON photo_info_rollup_monthly(person_uuid, full_name, YEAR_MONTH);

DROP TABLE IF EXISTS photos_per_user_daily;

CREATE TABLE photos_per_user_daily AS
SELECT
    person_uuid,
    --  //  full_name, 
    DATE,
    SUM(COUNT) AS COUNT,
    SUM(
        CASE
            WHEN which_camera = 'Front Camera'
                THEN COUNT
            ELSE 0
        END
    ) AS front_camera_count
FROM photo_info_rollup_daily
WHERE
    DATE > '1950-01-01'
GROUP BY 1, 2
ORDER BY COUNT DESC;

CREATE INDEX date_index_daily
ON photos_per_user_daily(DATE);

CREATE INDEX person_uuid_index_daily
ON photos_per_user_daily(person_uuid);

CREATE INDEX photo_per_user_daily_person_uuid_date_index
ON photos_per_user_daily(person_uuid, DATE);

DROP TABLE IF EXISTS date_series;

CREATE TABLE date_series AS WITH RECURSIVE dates AS (
    SELECT
        MIN(DATE) AS DATE
    FROM photos_per_user_daily
    UNION ALL
    SELECT
        DATE(DATE, '+1 day')
    FROM dates
    WHERE
        DATE < (
            SELECT
                MAX(DATE)
            FROM photos_per_user_daily
        )
)
SELECT
    dates.date
FROM dates;

CREATE INDEX date_index
ON date_series(DATE);

DROP TABLE IF EXISTS sum_photos_monthly;

CREATE TABLE sum_photos_monthly AS WITH main AS (
    SELECT
        full_name,
        YEAR_MONTH,
        SUM(COUNT) AS COUNT
    FROM photo_info_rollup_monthly
    GROUP BY 1, 2
    ORDER BY COUNT DESC
)
SELECT
    a.full_name,
    a.year_month,
    a.count,
    AVG(b.count) AS rolling_avg
FROM main a
JOIN main b
    ON b.year_month BETWEEN DATE(a.year_month, '-6 month')
    AND a.year_month
GROUP BY a.year_month, a.full_name, a.count
ORDER BY a.year_month;



DROP TABLE IF EXISTS names_ids;

CREATE TABLE names_ids AS
SELECT
    person_uuid,
    full_name,
    SUM(COUNT) AS COUNT,
    MAX(DATE) AS end_date,
    MIN(DATE) AS start_date
FROM photo_info_rollup_daily
WHERE
    person_uuid != 'no_person'
    AND full_name != 'no_name'
    AND full_name != 'no_face'
GROUP BY 1, 2
ORDER BY COUNT DESC;

DROP TABLE IF EXISTS people_sum;

CREATE TABLE people_sum AS
SELECT
    person_uuid,
    full_name,
    strftime('%Y-%m', date_created) || '-01' AS YEAR_MONTH,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
WHERE
    person_uuid IS NOT NULL
    AND full_name != ''
    AND full_name IS NOT NULL
GROUP BY 1, 2, 3
UNION ALL
SELECT
    '---' AS person_uuid,
    'All Photos' AS full_name,
    strftime('%Y-%m', date_created) || '-01' AS YEAR_MONTH,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
GROUP BY 1, 2, 3
ORDER BY COUNT DESC;

CREATE INDEX people_sum_uuid_date_index
ON people_sum(person_uuid, YEAR_MONTH);

DROP TABLE IF EXISTS people_sum_daily;

CREATE TABLE people_sum_daily AS
SELECT
    person_uuid,
    full_name,
    strftime('%Y-%m-%d', date_created) AS DATE,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
WHERE
    person_uuid IS NOT NULL
    AND full_name != ''
    AND full_name IS NOT NULL
GROUP BY 1, 2, 3
UNION ALL
SELECT
    '---' AS person_uuid,
    'All Photos' AS full_name,
    strftime('%Y-%m-%d', date_created) AS DATE,
    COUNT(DISTINCT zuuid) AS COUNT
FROM photo_info
GROUP BY 1, 2, 3
ORDER BY COUNT DESC;

CREATE INDEX people_sum_daily_uuid_date_index
ON people_sum_daily(person_uuid, DATE);
CREATE INDEX people_sum_daily_uuid_index
ON people_sum_daily(person_uuid);

-- drop table if exists total_sum;
-- create table total_sum as 
--     select
--     "---" as person_uuid,
--     "All Photos" as full_name,
--     strftime('%Y-%m', date_created) || '-01' as year_month, 
--     count(distinct zuuid) as count
--     from photo_info
--     group by 1,2,3
-- order by count desc;
-- create index total_sum_uuid_date_index on people_sum(person_uuid, year_month);
DROP TABLE IF EXISTS numeric_scores_monthly;

CREATE TABLE numeric_scores_monthly AS
-- with unweighted as (
SELECT
    person_uuid,
    strftime('%Y-%m', date_created) || '-01' AS YEAR_MONTH,
    COUNT( zuuid) AS COUNT,
    SUM(curation_score) AS curation_score,
    SUM(zm_activity_score) AS activity_score,
    SUM(zm_video_score) AS video_score,
    SUM(zm_audio_score) AS audio_score,
    SUM(zm_wallpaper_score) AS wallpaper_score,
    SUM(zm_autoplay_suggestion_score) AS autoplay_suggestion_score,
    SUM(zm_blurriness_score) AS blurriness_score,
    SUM(zm_exposure_score) AS exposure_score,
    SUM(zc_behavioral_score) AS behavioral_score,
    SUM(zc_failure_score) AS failure_score,
    SUM(zc_harmonious_color_score) AS harmonious_color_score,
    SUM(zc_immersiveness_score) AS immersiveness_score,
    SUM(zc_interaction_score) AS interaction_score,
    SUM(zc_interesting_subject_score) AS interesting_subject_score,
    SUM(zc_intrusive_object_presence_score) AS intrusive_object_presence_score,
    SUM(zc_lively_color_score) AS lively_color_score,
    SUM(zc_low_light) AS low_light,
    SUM(zc_noise_score) AS noise_score,
    SUM(zc_pleasant_camera_tilt_score) AS pleasant_camera_tilt_score,
    SUM(zc_pleasant_composition_score) AS pleasant_composition_score,
    SUM(zc_pleasant_lighting_score) AS pleasant_lighting_score,
    SUM(zc_pleasant_pattern_score) AS pleasant_pattern_score,
    SUM(zc_pleasant_perspective_score) AS pleasant_perspective_score,
    SUM(zc_pleasant_post_processing_score) AS pleasant_post_processing_score,
    SUM(zc_pleasant_reflection_score) AS pleasant_reflection_score,
    SUM(zc_pleasant_symmetry_score) AS pleasant_symmetry_score,
    SUM(zc_sharply_focused_subject_score) AS sharply_focused_subject_score,
    SUM(zc_tastefully_blurred_score) AS tastefully_blurred_score,
    SUM(zc_well_chosen_subject_score) AS well_chosen_subject_score,
    SUM(zc_well_framed_subject_score) AS well_framed_subject_score,
    SUM(zc_well_timed_shot_score) AS well_timed_shot_score
FROM photo_info
WHERE
    person_uuid IS NOT NULL
    AND full_name != ''
    AND full_name IS NOT NULL
GROUP BY 1, 2
UNION ALL
SELECT
    '---' AS person_uuid,
    strftime('%Y-%m', date_created) || '-01' AS YEAR_MONTH,
    COUNT( zuuid) AS COUNT,
    SUM(curation_score) AS curation_score,
    SUM(zm_activity_score) AS activity_score,
    SUM(zm_video_score) AS video_score,
    SUM(zm_audio_score) AS audio_score,
    SUM(zm_wallpaper_score) AS wallpaper_score,
    SUM(zm_autoplay_suggestion_score) AS autoplay_suggestion_score,
    SUM(zm_blurriness_score) AS blurriness_score,
    SUM(zm_exposure_score) AS exposure_score,
    SUM(zc_behavioral_score) AS behavioral_score,
    SUM(zc_failure_score) AS failure_score,
    SUM(zc_harmonious_color_score) AS harmonious_color_score,
    SUM(zc_immersiveness_score) AS immersiveness_score,
    SUM(zc_interaction_score) AS interaction_score,
    SUM(zc_interesting_subject_score) AS interesting_subject_score,
    SUM(zc_intrusive_object_presence_score) AS intrusive_object_presence_score,
    SUM(zc_lively_color_score) AS lively_color_score,
    SUM(zc_low_light) AS low_light,
    SUM(zc_noise_score) AS noise_score,
    SUM(zc_pleasant_camera_tilt_score) AS pleasant_camera_tilt_score,
    SUM(zc_pleasant_composition_score) AS pleasant_composition_score,
    SUM(zc_pleasant_lighting_score) AS pleasant_lighting_score,
    SUM(zc_pleasant_pattern_score) AS pleasant_pattern_score,
    SUM(zc_pleasant_perspective_score) AS pleasant_perspective_score,
    SUM(zc_pleasant_post_processing_score) AS pleasant_post_processing_score,
    SUM(zc_pleasant_reflection_score) AS pleasant_reflection_score,
    SUM(zc_pleasant_symmetry_score) AS pleasant_symmetry_score,
    SUM(zc_sharply_focused_subject_score) AS sharply_focused_subject_score,
    SUM(zc_tastefully_blurred_score) AS tastefully_blurred_score,
    SUM(zc_well_chosen_subject_score) AS well_chosen_subject_score,
    SUM(zc_well_framed_subject_score) AS well_framed_subject_score,
    SUM(zc_well_timed_shot_score) AS well_timed_shot_score
FROM photo_info
GROUP BY 1, 2
order by year_month;

CREATE INDEX numeric_scores_monthly_uuid_date_index
ON numeric_scores_monthly(person_uuid, YEAR_MONTH);