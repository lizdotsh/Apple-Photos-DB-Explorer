<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  export let person_group_stats;
  export let daily_with_rolling;
  export let start_date;
  export let end_date;
  import * as d3 from "d3";
  import * as aq from "arquero";
  import AgeEstimate from "./agged/AgeEstimate.svelte";
  import EthnicEstimate from "./agged/EthnicEstimate.svelte";
  import GenderEstimate from "./agged/GenderEstimate.svelte";
  import FacialHairEstimate from "./agged/FacialHairEstimate.svelte";
  import FacialExpressionEstimate from "./agged/FacialExpressionEstimate.svelte";
  import PhotosDayHistogram from "./agged/PhotosDayHistogram.svelte";

    let filtered;
    let table;
    let start_date_init;
    let end_date_init;
  $: daily_with_rolling.then((d) => {
    table = aq.from(d)
  });
    function filter_table(table, start_date, end_date){
        if (start_date && end_date) {
            return table
            ?.params({start_date, end_date})
            ?.filter((d, $) =>  d.date >= $.start_date && d.date <= $.end_date) ?? table;
        }
        if (start_date) {
            return table
            ?.params({start_date})
            ?.filter((d, $) =>  d.date >= $.start_date) ?? table;
        }
        if (end_date) {
            return table
            ?.params({end_date})
            ?.filter((d, $) =>  d.date <= $.end_date) ?? table;
        }
        return table;

    }
  $: filtered = filter_table(table, start_date, end_date);
  $: console.log(start_date, end_date, filtered);
</script>

  <div class="flex-container">
    <div id="graph1">

<GenderEstimate {person_group_stats} />
    </div>
    <div id="graph2"> 
<EthnicEstimate {person_group_stats} />
    </div>
    <div id="graph3">Graph 3</div>
  </div>
<GenderEstimate {person_group_stats} />

<EthnicEstimate {person_group_stats} />

<AgeEstimate {person_group_stats} />

<FacialHairEstimate {person_group_stats} />

<FacialExpressionEstimate {person_group_stats} />
{#if filtered}

<div class="flex-container-col">

    
    <div id="histogram">
        <PhotosDayHistogram {filtered} />
</div>
</div>



{:else}
 <p>Waiting for data...</p>
{/if}
<style>
    .flex-container {
      display: flex;
      justify-content: space-around;
    }
</style>
  
