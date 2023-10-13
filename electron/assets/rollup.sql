drop table if exists photo_info_rollup_daily;

create table photo_info_rollup_daily as

SELECT
-- Person uuid but replace null with 'no person'
coalesce(person_uuid, 'no_person') as person_uuid,
case 
when full_name = '' then 'no_name' 
when full_name is null then 'no_face'
else full_name end as full_name,
-- year-month of the photo. sqlite. 
-- https://www.sqlite.org/lang_datefunc.html
strftime('%Y-%m-%d', date_created) as date,
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
count(distinct zuuid) as count
from photo_info
group by
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20, 21;

drop table if exists photo_info_rollup_monthly;


create table photo_info_rollup_monthly as

SELECT
-- Person uuid but replace null with 'no person'
coalesce(person_uuid, 'no_person') as person_uuid,
case 
when full_name = '' then 'no_name' 
when full_name is null then 'no_face'
else full_name end as full_name,
-- year-month of the photo. sqlite. 
-- https://www.sqlite.org/lang_datefunc.html
strftime('%Y-%m', date_created) || '-01' as year_month,
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
count(distinct zuuid) as count
from photo_info
group by
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20, 21;


drop table if exists photos_per_user_daily;
create table photos_per_user_daily as
        select 
          full_name, 
          date,
          sum(count) as count
          from photo_info_rollup_daily
          where date > '1950-01-01'
          group by 1,2
          order by count desc;

drop table if exists date_series;
create table date_series as
WITH RECURSIVE dates AS (
  SELECT MIN(date) AS date FROM photos_per_user_daily
  UNION ALL
  SELECT date(date, '+1 day') FROM dates
  WHERE date < (SELECT MAX(date) FROM photos_per_user_daily)
)
SELECT dates.date
FROM dates;

drop table if exists sum_photos_monthly;

create table sum_photos_monthly as
with main as (
    select 
    full_name, 
    year_month,
    sum(count) as count
    from photo_info_rollup_monthly
    group by 1,2
    order by count desc
)
SELECT a.full_name, a.year_month, a.count, AVG(b.count) as rolling_avg
    FROM main a
    JOIN main b
    ON b.year_month BETWEEN date(a.year_month, '-6 month') AND a.year_month
    GROUP BY a.year_month, a.full_name, a.count
    ORDER BY a.year_month;

drop table if exists person_group_stats;
create table person_group_stats as 
select
person_uuid,
full_name,
-- year-month of the photo. sqlite. 
-- https://www.sqlite.org/lang_datefunc.html
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
sum(count) as count
from photo_info_rollup_monthly
where full_name != 'no_name' and full_name != 'no_face'
group by
1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19, 20;

drop table if exists names_ids;


create table names_ids as 
select person_uuid, full_name, sum(count) as count,
                max(date) as end_date, min(date) as start_date
                from photo_info_rollup_daily where person_uuid != "no_person"
                and full_name != "no_name"
                and full_name != "no_face"
                group by 1,2 order by count desc;