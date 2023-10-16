<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let daily_with_rolling;
    export let start_date;
    export let end_date;
    let table;
    let filtered;
    import * as aq from "arquero";
    //todays date
    function processtable(daily_with_rolling, start_date, end_date){
      //  let res;
        if (daily_with_rolling) {
            daily_with_rolling.then( d => {
            const tempv = aq.from(d);
            filtered = filter_table(tempv, start_date, end_date)
        });
        }
    }
    $: processtable(daily_with_rolling, start_date, end_date);
    // $: console.log(filtered);

    
 
    function filter_table(table, start_date, end_date){
        if (table?.nrows === 0) {
            return null;
        }
        console.log(table?._nrows);
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
  //$: filtered = filter_table(table, start_date, end_date);
//   $: console.log(start_date, end_date, filtered); 
    
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
    , Plot.binX({y: "count"}, {x: "thirty_day_rolling", tip: true, fill: "steelblue"}, ),
    ),
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