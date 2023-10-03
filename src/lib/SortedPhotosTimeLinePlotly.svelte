<script>
  import Plot from "svelte-plotly.js";

  import { onMount } from "svelte";
  import * as aq from "arquero";

  export let table;

  let chartElement;

function calcSixMonthRollingAvg(data) {
  if (!Array.isArray(data) || data.length === 0) return [];

  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const result = [];

  for (let i = 0; i < data.length; i++) {
    const currentDate = new Date(data[i].date);
    if (isNaN(currentDate.getTime())) continue;
    const sixMonthsAgo = new Date(currentDate);
    sixMonthsAgo.setMonth(currentDate.getMonth() - 2);

    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= sixMonthsAgo && itemDate <= currentDate;
    });

    const sum = filteredData.reduce((acc, item) => acc + (isNaN(item.count) ? 0 : item.count), 0);
    const avg = sum / (filteredData.length || 1);

    result.push({
      date: currentDate.toISOString(),
      rollingAvg: avg * 30,
    });
  }
  console.log(result);
  return result;
}


function fillMissingDates(arr) {
console.log(arr);
if (arr.length === 0) return [];
  const sortedArr = [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstDate = new Date(sortedArr[0].date);
  const lastDate = new Date(sortedArr[sortedArr.length - 1].date);
  const filledArr = [];

  for (let d = firstDate; d <= lastDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toISOString().split('T')[0];
    const existingObj = sortedArr.find(obj => obj.date === dateString);
    filledArr.push(existingObj ? existingObj : { date: dateString, count: 0 });
  }

  return filledArr;
}

/* let rolltest;
$: {
    console.log(table?.objects());
    if (table)
    { 
    rolltest = fillMissingDates(table?.objects());}
}
$: console.log(rolltest); */
  // const result = calcSixMonthRollingAvg(table?.objects());   
// Usage

 $: console.log(table);
  const layout = {
    title: "Number of Photos per Month",
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
  let filled;
  $: if (table) {
    filled = fillMissingDates(table?.objects());
    data = [
      {
        type: "scatter",
        mode: "lines",
        name: "Monthly",
        //x: table?.columnArray("date"),
        x: filled.map((d) => d.date),
        //y: table?.columnArray("count"),
        y: filled.map((d) => d.count),
        line: { color: "#17BECF" },
      },
           {
          type: "scatter",
          mode: "lines",
          name: '2mo Rolling Avg.',
          //x: table?.columnArray('date'),
          x: filled.map((d) => d.date),
          //y: calcSixMonthRollingAvg(table?.objects())?.map((d) => d.rollingAvg),
          y: calcSixMonthRollingAvg(filled)?.map((d) => d.rollingAvg),
          line: {color: '#7F7F7F'}
        } 
    ];
    //console.log(fillMissingDates(table?.objects()));
  }

</script>

<Plot {data} {layout} />
