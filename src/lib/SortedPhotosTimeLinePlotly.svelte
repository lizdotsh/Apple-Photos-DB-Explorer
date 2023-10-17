<script>
  import Plot from "svelte-plotly.js";

  import { onMount } from "svelte";
  import * as aq from "arquero";

  export let daily_with_rolling;

let table
$: table = daily_with_rolling;
//   $: daily_with_rolling.then((d) => {
//     table = aq.from(d)
//     .orderby('date');
    
//   }).catch((e) => {
//     console.log(e);
//   });

  $: console.log(table?.filter(d => d.thirty_day_rolling_week > 200));
  


 $: console.log(table);

  const layout = {
    title: "Number of Photos Detected per Week",
  //  width: 1000,
    width: 1500,
    height: 500,
    xaxis: {
      autorange: true,
      rangeselector: {
        buttons: [
          { count: 6, label: "6m", step: "month", stepmode: "backward" },
          { count: 1, label: "1y", step: "year", stepmode: "backward" },
          { count: 3, label: "3y", step: "year", stepmode: "backward" },
          { count: 5, label: "5y", step: "year", stepmode: "backward" },
          { step: "all" },
        ],
      },
      rangeslider: {},
      type: "date",
    },
    yaxis: { autorange: true, type: "linear"},
  };
  const config = { responsive: true };

  let data;
  let filled;
  $: if (table) {
    data = [
      {
        type: "scatter",
        mode: "lines",
        name: "Weekly Sum",
        x: table?.columnArray("date"),
       // x: filled.map((d) => d.date),
        y: table?.columnArray("seven_day_sum"),
        // y: filled.map((d) => d.count),
        line: { color: "#7eb0d5" },
      },
           {
          type: "scatter",
          mode: "lines",
          name: '30d Rolling',
          x: table?.columnArray('date'),
            y: table?.columnArray("thirty_day_rolling_week"),
        // y: filled.map((d) => d.count),
          line: {color: '#bd7ebe'}
        },
           {
          type: "scatter",
          mode: "lines",
          name: '90d Rolling',
          x: table?.columnArray('date'),
            y: table?.columnArray("ninety_day_rolling_week"),
        // y: filled.map((d) => d.count),
          line: {color: '#ffb55a'}
          
        } 
    ];
    //console.log(fillMissingDates(table?.objects()));
  }

</script>
{#if table}
  <Plot {data} {layout} {config}/>
{/if}
