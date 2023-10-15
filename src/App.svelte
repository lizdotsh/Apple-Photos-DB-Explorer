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
  import WorldProjection from "./lib/WorldProjection.svelte";
  import DoubleDateSlider from "./lib/DoubleDateSlider.svelte";

  let photos_per_user;
  let names_ids;
  let elm_name;
  let start_date_month;
  let end_date_month;
  let start_date;
  const today = new Date();

  let end_date; //= today?.toISOString()?.slice(0, 10);
  // Send SQL query to main process
  
  window.myAPI.sendSQL([
    {
      name: "names_ids",
      query: `select * from names_ids`,
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
        
        `,
    },
  ]);
  let photos_per_user_daily;
  const ym_to_dt = d3.timeParse("%Y-%m");
  // Receive SQL results
  window.myAPI.receiveSQLResults((results) => {
    console.log(results);
    photos_per_user_daily = aq
      .from(results.photos_per_user_daily)
      .orderby("date");
    //  .derive({rolling_count: aq.rolling(d => aq.op.average(d.count), [-60, 0])});
    names_ids = results.names_ids;
    //  user_time = results.photos_per_user;
  });
  $: photos_per_user = invoke_req("call-photos-per-user", {
    start_date,
    end_date,
  });
  $: console.log(photos_per_user);
  $: console.log(elm_name);
  let person_group_stats;
  let daily_with_rolling;
  let person;
  let latlong;
  let world;
  let us;
  async function invoke_req(api, arg) {
    try {
      const result = await window.myAPI.invoke(api, arg);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  $: person_group_stats = invoke_req("call-person-group-stats", {
    name_entry: elm_name,
    start_date,
    end_date,
  });
  $: daily_with_rolling = invoke_req("daily-zeroed-counts", [elm_name]);
  //$: latlong = invoke_req("call-lat-long", {elm_name, start_date, end_date});
  $: world = invoke_req("call-map-json", "world");
  $: us = invoke_req("call-map-json", "us");
  let avg_photos_daily;
  $: avg_photos_daily = elm_name;
  $: console.log(start_date, end_date);
  $: person = names_ids?.find((e) => e?.full_name === elm_name);
  function addMonth(isoString) {
    let [year, month] = isoString.split('-').map(Number);
    let date = new Date(year, month - 1);
    date.setMonth(date.getMonth() + 1);
  
    let newYear = date.getFullYear();
  let newMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${newYear}-${newMonth}`;
}
  function addMonths() {
    start_date_month = addMonth(start_date_month);
    end_date_month = addMonth(end_date_month);
  }
  function addEndRangeMonth() {
    end_date_month = addMonth(end_date_month);
  }
  $: console.log(person);
  $: start_date = start_date_month ? start_date_month + "-01" : undefined;
  $: end_date = end_date_month ? end_date_month + "-01" : undefined;

</script>

<!-- Random Normal -->

<!-- ... -->
<div id="title-selector">
   
  <div class="flex-container-title">
    {#if typeof names_ids !== "undefined"}
    <div class="flex-container-col">
      <div id = 'app-title'>
        Apple Photos DB Explorer
      </div>
          <SelectedInfo name_count={photos_per_user} {elm_name} {person} />
    </div>
    <div>
    </div>
      <div class="flex-container-col">
        <div id="title-text">
          <b>Select a name</b> 
        </div>
        <div id="selector" class="text-intro">
          <select bind:value={elm_name}>
            {#each names_ids as name_entry}
              <option value={name_entry.full_name}
                >{name_entry.full_name}</option
              >
            {/each}
          </select>
        </div>
          <!-- {person?.count ?? "N/A"} Photos of {elm_name} -->
      </div>
      <div id = "date-selector-slider">
            {#if person && names_ids}
            <DoubleDateSlider dateMin = {person?.start_date} dateMax = {person?.end_date} bind:start_date_month bind:end_date_month />
          
            {/if}
   
        
        
        <!-- {person?.start_date ?? "N/A"} to {person?.end_date ?? "N/A"} -->
      </div>
      
    {:else}
      <p>Waiting for data...</p>
    {/if}
  
  </div>
  
</div>
<div id = "not-sticky">
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
<div class="flex-container">
  <div id="photo-hist" style="max-width: 100%; margin: auto">
    <!-- <h2><br><br><br></h2> -->
    <PhotosDayHistogram {daily_with_rolling} {start_date} {end_date} />
  </div>
  <div id="SortedPhotosBar" style="max-width: 100%; margin: auto">
    <!-- make component smaller -->
    <SortedPhotosBar name_count={photos_per_user} {elm_name} />
  </div>
</div>

<AggStats {person_group_stats} />

<!-- <PhotosDayHistogram {daily_with_rolling} /> -->
</div>

<!-- <WorldProjection {latlong} {us} /> -->
<style>
    body {
        margin: 5px;
        max-width: 100%;
    }
  .flex-container {
    display: flex;
    justify-content: center;

    box-sizing: border-box;
  }
  .text-intro {
    max-width: 40%;
  }

  .flex-container-title {
    display: flex;
    justify-content: start;
    gap: 1em;
    max-width: 100%;
  }
  .flex-container-col {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: space-around;
    min-width: "30%";
  }
  #title-selector {
    position: sticky;
    top: 0;
    background: #ccc;
    z-index: 100;
    width: 100%;
    /* padding: 5px; */
    padding: 5px;
    box-sizing: border-box;

  }
  #date-selector-slider { 
    width: 100%;
    box-sizing: border-box;
  }
  #app-title {
    width: auto;
    white-space: nowrap;
    box-sizing: border-box;
    margin-bottom: 2px;
    font-weight: bold;
    font-size: 24px;
  }
  #title-text {
    padding-bottom: 5px;
    box-sizing: border-box;

  }


</style>
