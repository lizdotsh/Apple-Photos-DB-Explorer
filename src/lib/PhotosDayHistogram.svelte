<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "./Plot.svelte"
    import { html } from 'htl';
    export let daily_with_rolling;
    export let start_date;
    export let end_date;
    let filtered;
    import * as aq from "arquero";
    //todays date
    function processtable(daily_with_rolling, start_date, end_date){
      //  let res;
        if (daily_with_rolling) {
            // daily_with_rolling.then( d => {
            const tempv = aq.from(daily_with_rolling);
            filtered = filter_table(tempv, start_date, end_date)
        // });
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
    title: "Distribution of photos per week",
    caption: html`<span style=${{"font-size": "12px", "text-align": "left" }}>
        Frequency represents number of rolling 7 day windows with that number of photos. Red line is the average. 
        </span>`,
   y: {grid: true},
   x: {
   },
  // marginLeft: 120,
   marks: [
    Plot.rectY(filtered
        //table.params({start_date, end_date}).filter((d, $) =>  d.date >= $.start_date && d.date <= $.end_date)
    , Plot.binX({y: "count"}, {x:"seven_day_sum", tip: true, fill: "steelblue", inset: 0, stroke: "white"},  ),
    ),
 //   Plot.ruleY([0]),
    // add average x value 
    Plot.ruleX(filtered,
    Plot.groupZ({x: "mean"}, {x: 'seven_day_sum', stroke: 'red', tip: true, label: "Mean", strokeWidth: 2})
    ),
   ]
 }}
/>


{:else}
 <p>Waiting for data...</p>
{/if}
