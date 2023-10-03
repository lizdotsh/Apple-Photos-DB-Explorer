<script>
  import Plot from "svelte-plotly.js";

  import { onMount } from "svelte";
  import * as aq from "arquero";

  export let table;

  let chartElement;
function calcSixMonthRollingAvg(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  data.sort((a, b) => new Date(a.year_month).getTime() - new Date(b.year_month).getTime());
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const currentDate = new Date(data[i].year_month);
    if (isNaN(currentDate.getTime())) continue;
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.year_month);
      return itemDate >= sixMonthsAgo && itemDate <= currentDate;
    });

    const sum = filteredData.reduce((acc, item) => acc + (isNaN(item.count) ? 0 : item.count), 0);
    const avg = sum / (filteredData.length || 1);

    result.push({
      date: currentDate.toISOString(),
      rollingAvg: avg,
    });
  }
  console.log(result);
  return result;
}


  const layout = {
    title: "Time Series with Rangeslider",
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
    yaxis: { autorange: true, type: "linear" },
  };

  let data;
  $: if (table) {
    data = [
      {
        type: "scatter",
        mode: "lines",
        name: "Count",
        x: table?.columnArray("year_month"),
        y: table?.columnArray("count"),
        line: { color: "#17BECF" },
      },
           {
          type: "scatter",
          mode: "lines",
          name: 'Rolling Count',
          x: table?.columnArray('year_month'),
          y: calcSixMonthRollingAvg(table?.objects())?.map((d) => d.rollingAvg),
          line: {color: '#7F7F7F'}
        } 
    ];
  }

</script>

<Plot {data} {layout} />
