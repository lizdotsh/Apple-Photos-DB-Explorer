<script>
  import { onMount } from "svelte";
  export let daily_with_rolling;
  export let start_date_ms;
  export let end_date_ms;
  export let start_date_daily;
  export let end_date_daily;
  import Plotly from "plotly.js-dist";
  let domReady;

  $: if (domReady) {
    updateData(daily_with_rolling);
  }
  function formatData(table) {
    return [
      {
        type: "scatter",
        mode: "lines",
        name: "Weekly Sum",
        x: table?.columnArray("date"),
        y: table?.columnArray("seven_day_sum"),
        line: { color: "#7eb0d5" },
      },
      {
        type: "scatter",
        mode: "lines",
        name: "30d Rolling",
        x: table?.columnArray("date"),
        y: table?.columnArray("thirty_day_rolling_week"),
        line: { color: "#bd7ebe" },
      },
      {
        type: "scatter",
        mode: "lines",
        name: "90d Rolling",
        x: table?.columnArray("date"),
        y: table?.columnArray("ninety_day_rolling_week"),
        line: { color: "#ffb55a" },
      },
    ];
  }



  let date_range = [start_date_daily, end_date_daily];
  function handleRelayout(eventData) {
    date_range = eventData["xaxis.range"]?.map((d) => new Date(d)); //, eventData["xaxis.range[1]"]];
  }
  // $: console.log(date_range)
  onMount(() => {
    const layout = {
      title: "Number of Photos Detected per Week",
      //  width: 1000,
      width: 1500,
      height: 500,
      xaxis: {
        // autorange: true,
        range: [start_date_daily, end_date_daily],

        rangeselector: {
          buttons: [
            { count: 6, label: "6m", step: "month", stepmode: "backward" },
            { count: 1, label: "1y", step: "year", stepmode: "backward" },
            { count: 3, label: "3y", step: "year", stepmode: "backward" },
            { count: 5, label: "5y", step: "year", stepmode: "backward" },
            { step: "all" },
          ],
        },
        // rangeslider: {},
        type: "date",
      },
      yaxis: { autorange: true, type: "linear" },
    };
    const config = { responsive: true };
    const data = formatData(daily_with_rolling);
    Plotly.newPlot("sortedPlotly", data, layout, config).then(() => {
      domReady = true;
      const plotDiv = document.getElementById("sortedPlotly");
      plotDiv.on("plotly_relayout", handleRelayout);
    });
  });
  $: if (Plotly && domReady) {
    const update = {
      "xaxis.range[0]": start_date_ms,
      "xaxis.range[1]": end_date_ms,
    };
    Plotly.relayout("sortedPlotly", update);
  }
  function updateData(table) {
    Plotly.update("sortedPlotly", formatData(table));
  }
</script>

<div id="sortedPlotly">

</div> 
<!-- //   <Plot {data} {layout} {config}/> -->


