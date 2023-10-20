<script>
  let name;
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./lib/Plot.svelte";
  // arquero
  import * as aq from "arquero";
  import * as d3 from "d3";
  import SortedPhotosBar from "./lib/SortedPhotosBar.svelte";
  import SortedPhotosTimeLinePlotly from "./lib/SortedPhotosTimeLinePlotly.svelte";
  import GenderEstimate from "./lib/agged/GenderEstimate.svelte";
  import PhotosDayHistogram from "./lib/PhotosDayHistogram.svelte";
  import FacialHairEstimate from "./lib/agged/FacialHairEstimate.svelte";
  import FacialExpressionEstimate from "./lib/agged/FacialExpressionEstimate.svelte";
  import EthnicEstimate from "./lib/agged/EthnicEstimate.svelte";
  import AgeEstimate from "./lib/agged/AgeEstimate.svelte";
  import { api } from "./ipc.js";
  import StatusBar from "./lib/status_bar/StatusBar.svelte";
  import WhichCamera from "./lib/agged/WhichCamera.svelte";
  import GlassesEstimate from "./lib/agged/GlassesEstimate.svelte";
  import SelfieHeatmap from "./lib/SelfieHeatmap.svelte";
  import SmileType from "./lib/agged/SmileType.svelte";
  import NumericScores from "./lib/NumericScores.svelte";
  import SkinToneEstimate from "./lib/agged/SkinToneEstimate.svelte";
  import HairColorEstimate from "./lib/agged/HairColorEstimate.svelte";
  import Intro from "./lib/Intro.svelte";
  let person;
  let person_time;
  let people = {};
  let activeTab = "Tab1";
  let start_date = person?.start_date;
  let end_date = person?.end_date;
  let people_time;
  let start_date_ms;
  let end_date_ms;
  let start_date_daily;
  let end_date_daily;

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
    "hair_color_estimate",
    "age_estimate",
    "ethnicity_estimate",
    "skin_tone_estimate",
    "facial_hair_estimate",
    // "face_mask_estimate",
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
      //   console.log(data);
    });
  $: console.log("group", person_group_stats);
  let date_range_string;
  const today = new Date();
  let daily_with_rolling;
  $: api.getDailyZeroedCounts(person?.person_uuid).then((data) => {
    if (data) {
      data.forEach((d) => {
        d.parsed_date = d3.utcParse("%Y-%m-%d")(d.date);
      });
      daily_with_rolling = data ? aq.from(data) : null;
      console.log(data);
    }
  });
  $: console.log(start_date, end_date);
  $: console.log([start_date, end_date]);
  let person_numeric_scores;
  $: api
    .getNumericScoresTime(person?.person_uuid, start_date, end_date)
    .then((d) => {
      person_numeric_scores = d;
      console.log(d);
    });

  //   $: console.log(people[person_id]);
</script>

<StatusBar
  bind:people
  bind:person
  {person_time}
  bind:start_date
  bind:end_date
  bind:activeTab
  bind:start_date_daily
  bind:end_date_daily
  bind:start_date_ms
  bind:end_date_ms
/>

<!-- <div class="tabs">
    <button on:click={() => setActive('Tab1')}>Main</button>
    <button on:click={() => setActive('Tab2')}>Activity Map</button>

</div> -->

{#if activeTab === "Tab1"}
  {#if person}
    <Intro {people} {person} />
  {/if}

  <div id="not-sticky">
    <div class="flex-container">
      <div id="time">
        {#if daily_with_rolling}
          <SortedPhotosTimeLinePlotly
            {daily_with_rolling}
            {start_date_ms}
            {end_date_ms}
          />
          <!-- <AggStats {person_group_stats} {daily_with_rolling} /> -->
        {:else}
          <p>Waiting for data...</p>
        {/if}
      </div>
    </div>
    <div class="flex-container">
      <div
        id="photo-hist"
        style="max-width: 100%; vertical-align: top; margin-bottom: 75px"
      >
        <!-- <h2><br><br><br></h2> -->
        <PhotosDayHistogram {daily_with_rolling} {start_date} {end_date} />
      </div>
      <div id="SortedPhotosBar" style="max-width: 100%;">
        <!-- make component smaller -->
        <SortedPhotosBar {people_time} {people} {person} />
      </div>
    </div>

    <div class="agg-stats-grouping">
      <!-- {#if person_group_stats?.length > 0} -->
      <div class="flex-container">
        <GenderEstimate {person_group_stats} {start_date} {end_date} />
        <SmileType {person_group_stats} {start_date} {end_date} />
      </div>
      <div class="flex-container">
        <GlassesEstimate {person_group_stats} {start_date} {end_date} />
        <WhichCamera {person_group_stats} {start_date} {end_date} />
      </div>
      <div class="flex-container">
        <AgeEstimate {person_group_stats} {start_date} {end_date} />

        <EthnicEstimate {person_group_stats} {start_date} {end_date} />
      </div>
      <div class="flex-container">
        <FacialExpressionEstimate
          {person_group_stats}
          {start_date}
          {end_date}
        />

        <FacialHairEstimate {person_group_stats} {start_date} {end_date} />
      </div>
      <div class="flex-container">
        <SkinToneEstimate {person_group_stats} {start_date} {end_date} />
        <HairColorEstimate {person_group_stats} {start_date} {end_date} />
      </div>
    </div>
    j

    <!-- <PhotosDayHistogram {daily_with_rolling} /> -->
  </div>
{:else if activeTab === "Tab2"}
  <div class="flex-container">
    <SelfieHeatmap {daily_with_rolling} {start_date} {end_date} />
  </div>
{:else if activeTab === "Tab3"}
  <NumericScores {person_numeric_scores} />
{/if}

<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
