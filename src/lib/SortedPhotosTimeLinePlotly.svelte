<script>
  import { onMount } from "svelte";
  export let daily_with_rolling;
  export let start_date_ms;
  export let end_date_ms;
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

  let date_range = [start_date_ms, end_date_ms];
  function handleRelayout(eventData) {
    date_range = eventData["xaxis.range"]?.map((d) => new Date(d)); //, eventData["xaxis.range[1]"]];
  }
  onMount(() => {
    const layout = {
      title: "Number of Photos Detected per Week",
      //  width: 1000,
      width: 1500,
      height: 500,
      xaxis: {
        range: [start_date_ms, end_date_ms],
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

<div id="sortedPlotly" />
