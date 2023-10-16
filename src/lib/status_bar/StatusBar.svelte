<script>
  
  import DoubleDateSlider from "./DoubleDateSlider.svelte";
  import { html } from "htl";
  import { api } from "../../ipc.js";
  import { onMount } from "svelte";
  export let people;
  export let person;
  export let person_time;
  export let start_date;
    export let end_date;
    $: console.log("PERSON",people, person);
    let person_id;
   // let people = {};
    onMount(async () => {
    people = await api.getPeople().then((data) => {
        person_id = Object.keys(data)[0];
      console.log(data);

      return data;
      //   person_id = Object.keys(people)[0];
    });
  });
  $: person = people[person_id];
 

  // $: person_time = people_time?.objects()?.find((e) => e.person_uuid === person_id);
  let elm_name;
  let start_date_month;
  let end_date_month;

  $: console.log(person);
  
  $: console.log(start_date, end_date);
  $: start_date = start_date_month ? start_date_month + "-01" : undefined;
  $: end_date = end_date_month ? end_date_month + "-01" : undefined;

 // $: console.log(people[person_id]);
</script>


<div id="title-selector">
  <div class="flex-container-title">
    <div class="flex-container-col">
      <div id="app-title">Apple Photos DB Explorer</div>
      <div>
      {person_time?.count ?? "error"} of {person?.count ?? "N/A"} Photos Selected
      </div>
      <!-- <SelectedInfo name_count={person?.count} {elm_name} {person} /> -->
      <div class="flex-container-col">
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
</style>

