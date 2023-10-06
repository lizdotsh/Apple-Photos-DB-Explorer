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

</script>

<GenderEstimate {person_group_stats} />

<EthnicEstimate {person_group_stats} />

<AgeEstimate {person_group_stats} />

<FacialHairEstimate {person_group_stats} />

<FacialExpressionEstimate {person_group_stats} />