import {db, txGetOne} from './db_utils.cjs';

export function getPerson(person_uuid) {
    
    return dbGetOne(
        `
        select
        person_uuid,
        full_name,
        sum(count) as count,
        min(date) as start_date,
        max(date) as end_date
        from
        photo_info_rollup_daily
        `
    , [person_uuid]);
}