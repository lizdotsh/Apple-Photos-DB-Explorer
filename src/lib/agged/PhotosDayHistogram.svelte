<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let daily_with_rolling;
    import * as aq from "arquero";
    let table;
    let start_date //= new Date('2020-01-01');
    let filt;
    let end_date //= new Date('2020-12-31');
    let start_date_init;
    let end_date_init;
    //todays date
    $: console.log(daily_with_rolling);
    $: daily_with_rolling.then((d) => {
    
    table = aq.from(d)
    .orderby('date');
    //table = table.params({start_date, end_date});
    });
    $: {
    if (start_date && end_date) {
        filt = table
    ?.params({start_date, end_date})
    ?.filter((d, $) =>  d.date >= $.start_date && d.date <= $.end_date) ?? table;
    } else if (start_date) {
        filt = table
    ?.params({start_date})
    ?.filter((d, $) =>  d.date >= $.start_date) ?? table;
    } else if (end_date) {
        filt = table
    ?.params({end_date})
    ?.filter((d, $) =>  d.date <= $.end_date) ?? table;
    } else {
        filt = table;
    } }
    $: if (table) {
        start_date_init = table.rollup({start_date: aq.op.min('date')}).objects()[0].start_date;
        end_date_init = table.rollup({end_date: aq.op.max('date')}).objects()[0].end_date;
    }
    
    //date
 // $: start_date = start_date;
  </script>

{#if filt}
  <div class="flex-container-col">

    <div id="date-selectors"> 
            <div>

        <b>Choose a date range:    </b>
            </div>
        <!-- // starting and ending date selectors svelte -->
        <div id="start-date">

        <input type="date" bind:value={start_date} />
        <input type="date" bind:value={end_date} />
        </div>
    </div>
    <div id="histogram">

 <PlotRender
 options={{
   y: {grid: true},
   x: {
   },
   marginLeft: 120,
   marks: [
    Plot.rectY(filt
        //table.params({start_date, end_date}).filter((d, $) =>  d.date >= $.start_date && d.date <= $.end_date)
    , Plot.binX({y: "count"}, {x: "thirty_day_rolling"})),
    Plot.ruleY([0])
   ]
 }}
/>

</div>
</div>

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