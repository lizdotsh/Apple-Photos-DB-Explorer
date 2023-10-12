<script>
  let name;
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./lib/Plot.svelte";
  // arquero
  import * as aq from "arquero";
  import * as d3 from "d3";
  import SortedPhotosBar from "./lib/person_agnostic/SortedPhotosBar.svelte";
  import SortedPhotosTimeLine from "./lib/SortedPhotosTimeLine.svelte";
  import SortedPhotosTimeLinePlotly from "./lib/SortedPhotosTimeLinePlotly.svelte";
  import AggStats from "./lib/AggStats.svelte";
  import AgeEstimate from "./lib/agged/GenderEstimate.svelte";
  import GenderEstimate from "./lib/agged/GenderEstimate.svelte";
  import PhotosDayHistogram from "./lib/agged/PhotosDayHistogram.svelte";
  import SelectedInfo from "./lib/SelectedInfo.svelte";

  let photos_per_user;
  let names_ids;
  let elm_name;
  let start_date_month;
  let end_date_month;
   let start_date;
    const today = new Date();
   let end_date;//= today?.toISOString()?.slice(0, 10);    
  // Send SQL query to main process
  $: start_date = start_date_month ? start_date_month + "-01" : undefined;
    $: end_date = end_date_month ? end_date_month + "-01" : undefined;
  window.myAPI.sendSQL([
    
    {
      name: "names_ids",
      query: `select person_uuid, full_name, sum(count) as count
                from photo_info_rollup_monthly where person_uuid != "no_person"
                and full_name != "no_name"
                and full_name != "no_face"
                group by 1,2 order by count desc;`,
    },
    {
        name: "photos_per_user_daily",
        query: `
          select 
          full_name, 
          date,
          sum(count) as count
          from photo_info_rollup_daily
          group by 1,2
          order by count desc
        
        `
    }
  ]);
  let photos_per_user_daily;
  const ym_to_dt = d3.timeParse("%Y-%m");
  // Receive SQL results
  window.myAPI.receiveSQLResults((results) => {
    console.log(results);
    photos_per_user_daily = aq.from(
      results.photos_per_user_daily
    ).orderby("date");
  //  .derive({rolling_count: aq.rolling(d => aq.op.average(d.count), [-60, 0])});
    names_ids = results.names_ids;
    //  user_time = results.photos_per_user;
  });
  $: photos_per_user = invoke_req("call-photos-per-user", {start_date, end_date});
  $: console.log(photos_per_user);
  $: console.log(elm_name);
    let person_group_stats;
    let daily_with_rolling;

    async function invoke_req(api, arg) {
        try {
            const result = await window.myAPI.invoke(api, arg);
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        }
    }
    async function invoke_req_date(api, arg, start_date, end_date) {
        try {
            console.log(start_date, end_date);
            const result = await window.myAPI.invoke(api, arg, start_date, end_date);
            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    $: person_group_stats = invoke_req("call-person-group-stats", {name_entry: elm_name, start_date, end_date});
    $: daily_with_rolling = invoke_req("daily-zeroed-counts", [elm_name]);
   let avg_photos_daily; 
    $: avg_photos_daily = elm_name
    $: console.log(start_date, end_date);
    
</script>
<div class="flex-container">
    <div id="selector" class = "text-intro">
<!-- Random Normal -->

<h1>Apple Photos DB Explorer</h1>
<!-- ... -->
{#if typeof names_ids !== "undefined"}
  <select bind:value={elm_name} >
    {#each names_ids as name_entry}
      <option value={name_entry.full_name}>{name_entry.full_name}</option>
    {/each}
  </select>
  <div id="date-selectors"> 
    <div>

<b>Choose a date range:    </b>
    </div>
<!-- // starting and ending date selectors svelte -->
<div id="start-date">

<input type="month" bind:value={start_date_month} max = {
    // minus one month
    d3.timeFormat("%Y-%m")(new Date((end_date_month ?? today.toISOString().slice(0,7)) + "-01")
    .setMonth(new Date((end_date_month ?? today.toISOString().slice(0,7)) + "-01").getMonth() ))
 } />
// today minus one month
<input type="month" bind:value={end_date_month} min = {start_date_month} max = {today.toISOString().slice(0, 7)} />
Note: graphs unreliable if no photos in date range
</div>
</div>
<SelectedInfo name_count = {photos_per_user} {elm_name} {names_ids} />
 
{:else}
  <p>Waiting for data...</p>
{/if}
    </div>

  <div id="SortedPhotosBar">

<!-- make component smaller -->

<SortedPhotosBar name_count={photos_per_user} {elm_name} />
</div>
</div>
<div class="flex-container">
<div id="time">
    {#if daily_with_rolling}
  <SortedPhotosTimeLinePlotly {daily_with_rolling} />
<!-- <AggStats {person_group_stats} {daily_with_rolling} /> -->
{:else}
  <p>Waiting for data...</p>
{/if}
</div>
</div>
<AggStats {person_group_stats}{daily_with_rolling} {start_date} {end_date} />



<!-- <PhotosDayHistogram {daily_with_rolling} /> -->


<style>
    .flex-container {
      display: flex;
      justify-content: space-around;
      min-width: "30%";
    }
    .text-intro {
        max-width: 40%;
    }
  </style>