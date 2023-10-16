
<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  export let daily_with_rolling;
  export let start_date;
  export let end_date;
  import * as d3 from "d3";
  import * as aq from "arquero";
   // const toDT = dt => d3.utcParse("%Y-%m-%d")(dt);
    $: filt = daily_with_rolling
    ?.derive({
        "year": d => aq.op.year(d.parsed_date),
        "week": d => aq.op.week(d.parsed_date),
        "dayofweek": d => aq.op.dayofweek(d.parsed_date)
    })
    $: console.log(filt);

    function getYearsBetweenDates(startDate, endDate) {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years; 
  
}

$: dm = getYearsBetweenDates(start_date, end_date);

   
  
</script>

{#if filt}
  <PlotRender

    options={{
      padding: 0,
    x: {axis: null},
    y: {tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0},
    fy: {tickFormat: "", domain: dm},
    color: {scheme: "PiYG", legend: true},
    marks: [
      Plot.cell(filt, {
       // x: (d) => d3.utcWeek.count(d3.utcYear(d.parsed_date), d.parsed_date),
        x: "week",
        y: "dayofweek",
        fy: "year",
        // y: (d) => d.parsed_date.getUTCDay(),
        // fy: (d) => d.parsed_date.getUTCFullYear(),
        fill: (d) => d.count == 0 ? 0 : Math.log(d.count),//(d, i) => i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,
       // title: (d, i) => i > 0 ? ((d.Close - dji[i - 1].Close) / dji[i - 1].Close * 100).toFixed(1) : NaN,
        inset: 0.5,
        tip: true
      })
    ]
  }}/>
{:else}
  <p>Waiting for data...</p>
{/if}


