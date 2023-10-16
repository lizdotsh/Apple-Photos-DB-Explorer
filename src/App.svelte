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
  import WorldProjection from "./lib/WorldProjection.svelte";
  import DoubleDateSlider from "./lib/status_bar/DoubleDateSlider.svelte";
  import FacialHairEstimate from "./lib/agged/FacialHairEstimate.svelte";
  import FacialExpressionEstimate from "./lib/agged/FacialExpressionEstimate.svelte";
  import EthnicEstimate from "./lib/agged/EthnicEstimate.svelte";
  import AgeEstimate from "./lib/agged/AgeEstimate.svelte";
  import { html } from "htl";
  import { api } from "./ipc.js";
  import { onMount } from "svelte";
  import StatusBar from "./lib/status_bar/StatusBar.svelte";
  let person;
  let people = {};

  let person_time;
  let people_time;

  $: api.getPeopleTime(start_date, end_date).then((data) => {
    people_time = aq.from(data);
    person_time = {
      ...data.find((e) => e.person_uuid === person?.person_uuid),
      start_date,
      end_date,
    };
  });
  let person_group_stats;
  const group_stats = [
    "camera_make",
    "camera_model",
    "face_count",
    "gender_estimate",
    "age_estimate",
    "ethnicity_estimate",
    "skin_tone_estimate",
    "facial_hair_estimate",
    "face_mask_estimate",
    "face_expression_estimate",
    "pose_type_estimate",
    "smile_estimate",
    "smile_type_estimate",
    "smile_combined_estimate",
    "lip_makeup_estimate",
    "winking_estimate",
    "glasses_estimate",
    "eye_makeup_estimate",
    "which_camera",
  ];
  $: api
    .getPersonStat(person?.person_uuid, start_date, end_date, group_stats)
    .then((data) => {
      person_group_stats = data;
      console.log(data);
    });
  $: console.log("group", person_group_stats);
  let start_date;
  let date_range_string;
  const today = new Date();
  // let peopletest;
  // $: peopletest = window.db.getPeople();
  // $: console.log(peopletest);
  let end_date; //= today?.toISOString()?.slice(0, 10);
  // Send SQL query to main process

  let latlong;
  let world;
  let us;
 let daily_with_rolling;
  $: api.getDailyZeroedCounts(person?.person_uuid).then((data) => {
    daily_with_rolling = data ? aq.from(data): null;
    console.log(data);
  });
  //$: latlong = invoke_req("call-lat-long", {elm_name, start_date, end_date});
//   $: world = invoke_req("call-map-json", "world");
//   $: us = invoke_req("call-map-json", "us");
  $: console.log(start_date, end_date);
 // $: start_date = start_date_month ? start_date_month + "-01" : undefined;
  //$: end_date = end_date_month ? end_date_month + "-01" : undefined;
  $: date_range_string = html`<span
    style=${{ "font-size": "12px", padding: "2px", margin: "2px" }}
    >${start_date ?? "error"} to ${end_date ?? "error"}</span
  >`;
  $: console.log(date_range_string);

//   $: console.log(people[person_id]);
</script>

x
<StatusBar bind:people bind:person {person_time} bind:start_date bind:end_date />
<!-- {/if} -->
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
        Date range: {start_date} to {end_date}
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
