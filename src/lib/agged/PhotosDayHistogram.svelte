<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let filtered;
    import * as aq from "arquero";
    //todays date
   
    
    //date
 // $: start_date = start_date;
  </script>

{#if filtered}
  

 <PlotRender
 options={{
   y: {grid: true},
   x: {
   },
  // marginLeft: 120,
   marks: [
    Plot.rectY(filtered
        //table.params({start_date, end_date}).filter((d, $) =>  d.date >= $.start_date && d.date <= $.end_date)
    , Plot.binX({y: "count"}, {x: "thirty_day_rolling"})),
    Plot.ruleY([0])
   ]
 }}
/>


{:else}
 <p>Waiting for data...</p>
{/if}
<style>
    .flex-container-col {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      min-width: "30%";
    }
    .flex-container-row {
      display: flex;
      justify-content: space-around;
    }
    .text-intro {
        max-width: 40%;
    }
  </style>