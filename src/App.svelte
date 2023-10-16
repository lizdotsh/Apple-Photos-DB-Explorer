<script>
  let name;
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./lib/Plot.svelte";
  // arquero
  import * as aq from "arquero";
  import * as d3 from "d3";
  import SortedPhotosBar from "./lib/SortedPhotosBar.svelte";
  import SortedPhotosTimeLine from "./lib/SortedPhotosTimeLine.svelte";
  import SortedPhotosTimeLinePlotly from "./lib/SortedPhotosTimeLinePlotly.svelte";
  import GenderEstimate from "./lib/agged/GenderEstimate.svelte";
  import PhotosDayHistogram from "./lib/agged/PhotosDayHistogram.svelte";
  import SelectedInfo from "./lib/SelectedInfo.svelte";
  import WorldProjection from "./lib/WorldProjection.svelte";
  import DoubleDateSlider from "./lib/DoubleDateSlider.svelte";
  import FacialHairEstimate from "./lib/agged/FacialHairEstimate.svelte";
  import FacialExpressionEstimate from "./lib/agged/FacialExpressionEstimate.svelte";
  import EthnicEstimate from "./lib/agged/EthnicEstimate.svelte";
  import AgeEstimate from "./lib/agged/AgeEstimate.svelte";
  import { html } from "htl";
  import { api } from "./ipc.js";
  import { onMount } from "svelte";
  let people = {};
  let person_id;
  onMount(async () => {
    people = await api.getPeople().then((data) => {
      person_id = Object.keys(data)[0];
      console.log(data);

      return data;
 //   person_id = Object.keys(people)[0];
    });
  });
  $: person = people[person_id];

  let person_time;
  let people_time;

   $: api.getPeopleTime(start_date, end_date).then((data) => {
       people_time =  aq.from(data);
       person_time = {...(data.find((e) => e.person_uuid === person_id)), start_date, end_date};
    
    });
     $: console.log("person_time", person_time);
// $: person_time = people_time?.objects()?.find((e) => e.person_uuid === person_id);
  let elm_name;
  let start_date_month;
  let end_date_month;
  let start_date;
  let date_range_string;
  const today = new Date();
  // let peopletest;
  // $: peopletest = window.db.getPeople();
  // $: console.log(peopletest);
  let end_date; //= today?.toISOString()?.slice(0, 10);
  // Send SQL query to main process

 
  $: photos_per_user = invoke_req("call-photos-per-user", {
    start_date,
    end_date,
  });
  $: console.log(photos_per_user);
  $: console.log(elm_name);
  let person_group_stats;
  let daily_with_rolling;
  //   let person;
  let latlong;
  let world;
  let us;
  async function invoke_req(api, arg) {
    try {
      const result = await window.myAPI.invoke(api, arg);
     // console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  }
  $: person_group_stats = invoke_req("call-person-group-stats", {
    name_entry: person?.full_name,
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
  //   $: person = names_ids?.find((e) => e?.full_name === elm_name);
  function addMonth(isoString) {
    let [year, month] = isoString.split("-").map(Number);
    let date = new Date(year, month - 1);
    date.setMonth(date.getMonth() + 1);

    let newYear = date.getFullYear();
    let newMonth = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${newYear}-${newMonth}`;
  }
  function addMonths() {
    start_date_month = addMonth(start_date_month);
    end_date_month = addMonth(end_date_month);
  }
  function addEndRangeMonth() {
    end_date_month = addMonth(end_date_month);
  }
  $: start_date = start_date_month ? start_date_month + "-01" : undefined;
  $: end_date = end_date_month ? end_date_month + "-01" : undefined;
  $: date_range_string = html`<span
    style=${{ "font-size": "12px", padding: "2px", margin: "2px" }}
    >${start_date_month ?? "error"} to ${end_date_month ?? "error"}</span
  >`;
  $: console.log(date_range_string);

  $: console.log(people[person_id]);
</script>

<!-- Random Normal -->

<!-- ... -->
<div id="title-selector">
  <div class="flex-container-title">
      <div class="flex-container-col">
        <div id="app-title">Apple Photos DB Explorer</div>
        <SelectedInfo name_count={photos_per_user} {elm_name} {person} />
        <div class = "flex-container-col">
            <!-- {people_time?.find()} of {person?.count ?? "N/A"} photos selected. -->
          </div>

      </div>
      <div />
      <div class="flex-container-col">
        <div id="title-text">
          <b>Select a name</b>
        </div>
        <div id="selector" class="text-intro">
          
          <select bind:value={person_id}>
            {#each Object.keys(people) as pid}
              <option value={pid}>{people[pid]["full_name"]}</option>
            {/each}
          </select>
        </div>
        <!-- {person?.count ?? "N/A"} Photos of {elm_name} -->
      </div>
      <div id="date-selector-slider">
        {#if person}
          <DoubleDateSlider
            dateMin={person?.start_date}
            dateMax={person?.end_date}
            bind:start_date_month
            bind:end_date_month
          />
        {/if}

        <!-- {person?.start_date ?? "N/A"} to {person?.end_date ?? "N/A"} -->
      </div>
  </div>
</div>
<div id="not-sticky">
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
      <SortedPhotosBar {people_time} />
    </div>
  </div>

  <div id="agg-stats-grouping">
    <!-- {#if person_group_stats?.length > 0} -->
    <div class="flex-container">
      <GenderEstimate {person_group_stats} />
    </div>

    <div class="flex-container">
      <AgeEstimate {person_group_stats} />

      <EthnicEstimate {person_group_stats} />
    </div>
    <div class="flex-container">
      <div>
        Date range: {start_date_month} to {end_date_month}
        <FacialExpressionEstimate {person_group_stats} {date_range_string} />
      </div>

      <FacialHairEstimate {person_group_stats} />
    </div>
  </div>

  <!-- <PhotosDayHistogram {daily_with_rolling} /> -->
</div>
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />

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
