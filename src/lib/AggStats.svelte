<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  export let person_group_stats;
  import * as d3 from "d3";
  import * as aq from "arquero";
  import AgeEstimate from "./agged/AgeEstimate.svelte";
  import EthnicEstimate from "./agged/EthnicEstimate.svelte";
  import GenderEstimate from "./agged/GenderEstimate.svelte";
  import FacialHairEstimate from "./agged/FacialHairEstimate.svelte";
  import FacialExpressionEstimate from "./agged/FacialExpressionEstimate.svelte";
  import PhotosDayHistogram from "./agged/PhotosDayHistogram.svelte";

  
</script>

<!-- {#if person_group_stats?.length > 0} -->
  <div class="flex-container">

<GenderEstimate {person_group_stats} />

  </div>

<div class="flex-container">
<AgeEstimate {person_group_stats} />

<EthnicEstimate {person_group_stats} />
</div>
<div class="flex-container">

<FacialExpressionEstimate {person_group_stats} />

<FacialHairEstimate {person_group_stats} />
</div>

<style>
    .flex-container {
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
    }
</style>
  
<!-- {:else} -->
  <!-- <p>Not Enough Photos</p> -->
<!-- {/if} -->