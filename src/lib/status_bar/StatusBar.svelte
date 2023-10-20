<script>
  import DoubleDateSlider from "./DoubleDateSlider.svelte";
  import { api } from "../../ipc.js";
  import { onMount } from "svelte";
  export let people;
  export let person;
  export let person_time;
  export let start_date;
  export let activeTab;
  export let end_date;
  export let start_date_daily;
  export let end_date_daily;
  export let start_date_ms;
  export let end_date_ms;

  let person_id;
  // let people = {};
  onMount(async () => {
    people = await api.getPeople().then((data) => {
      person_id = Object.keys(data)[0];
      console.log(data);

      return data;
    });
  });
  $: person = people[person_id];

  let start_date_month;
  let end_date_month;

  $: console.log(person);

  $: console.log(start_date, end_date);
  $: start_date = start_date_month ? start_date_month + "-01" : undefined;
  $: end_date = end_date_month ? end_date_month + "-01" : undefined;
  function setActive(tab) {
    activeTab = tab;
  }
</script>

<div id="title-selector">
  <div class="flex-container-title">
    <div class="flex-container-col title-with-tabs">
      <div id="app-title">Apple Photos DB Explorer</div>
      <div>
        {person_time?.count ?? "error"} of {person?.count ?? "N/A"} Photos Selected
      </div>
      <div class="flex-container">
        <div class="tabs">
          <button
            class:active-tab={activeTab === "Tab1"}
            on:click={() => setActive("Tab1")}>Main</button
          >
          <button
            class:active-tab={activeTab === "Tab2"}
            on:click={() => setActive("Tab2")}>Photo Heatmap</button
          >
          <button
            class:active-tab={activeTab === "Tab3"}
            on:click={() => setActive("Tab3")}>Numeric Scores</button
          >
        </div>
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
            <!-- <option value="---">---</option> -->
            <option value={pid}>{people[pid]["full_name"]}</option>
          {/each}
        </select>
      </div>
      
      <div>
        {#if person_id === "---"}
    <span style="color: red;">Warning: </span>No face selected, showing stats for all photos combined.
    {:else}
    <br><br>
    {/if}
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
          bind:start_date_ms
          bind:end_date_ms
          bind:start_date_daily
          bind:end_date_daily

        />
      {/if}

    </div>
  </div>
</div>

<style>
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
  .tabs {
    /* display: flex; */
    justify-content: space-around;
    margin-top: 0.5em;
    background-color: #ccc;
    /* padding: 10px; */
    border-radius: 5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .active-tab {
    background-color: #59aef4;
    color: #fff;
  }
  .title-with-tabs {
    min-width: fit-content;
  }
</style>
