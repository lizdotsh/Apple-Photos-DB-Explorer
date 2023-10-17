<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  export let daily_with_rolling;
  export let start_date;
  export let end_date;
  import * as aq from "arquero";
  let selfieSelector = "front_camera_count";
  $: filt = daily_with_rolling?.derive({
    year: (d) => aq.op.year(d.parsed_date),
    week: (d) => aq.op.week(d.parsed_date),
    dayofweek: (d) => aq.op.dayofweek(d.parsed_date),
  });
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
  $: num = filt?.rollup({ sum: (d) => aq.op.sum(d.front_camera_count) });

  $: dm = getYearsBetweenDates(start_date, end_date);
  //   $: quantile95 = filt
  //   ?.params({selfieSelector})
  //   ?.rollup({ percentile95: (d, $)=> aq.topn(d[$.selfieSelector], 0.999) })
  //   .get('percentile95');
  //   $: console.log(quantile95)
  $: console.log(num);
  $: heat_title =
    selfieSelector === "front_camera_count"
      ? "Selfie Heatmap"
      : "Front Camera Heatmap";
</script>

<!--button to toggle between selfie mode and everything-->

<div class="flex-container-col">
  <div class="radio-container">
    <label for="only-selfies">
    <input
      type="radio"
      id="only-selfies"
      name="is-selfie"
      value="front_camera_count"
      checked
      bind:group={selfieSelector}
    />
    Selfies Only
    </label>
    <label for="all-photos">
    <input
      type="radio"
      id="All-Photos"
      name="is-selfie"
      value="count"
      bind:group={selfieSelector}
    />
All Photos</label>
  </div>
  {#if filt}
    <PlotRender
      options={{
        padding: 0,
        title: heat_title,
        x: {
          label: "Week of Year",
          axis: null,
        },

        y: {
          label: "Day of Week",
          tickFormat: Plot.formatWeekday("en", "narrow"),
          tickSize: 0,
        },
        fy: { label: "Year", tickFormat: "", domain: dm },
        marginRight: 60,
        color: {
          scheme: "PiYG",
          legend: false,
          //   type: "diverging-symlog",
          // domain: [0, 100]
        },
        marks: [
          Plot.cell(filt, {
            // x: (d) => d3.utcWeek.count(d3.utcYear(d.parsed_date), d.parsed_date),
            x: "week",
            y: "dayofweek",
            fy: "year",
            channels: {
              "Photo Count": (d) => d[selfieSelector],
              Date: (d) => d.date,
            },
            // y: (d) => d.parsed_date.getUTCDay(),
            // fy: (d) => d.parsed_date.getUTCFullYear(),
            fill: (d) =>
              d[selfieSelector] === 0 ? 0 : Math.log(d[selfieSelector]), //(d, i) => i > 0 ? (d.Close - dji[i - 1].Close) / dji[i - 1].Close : NaN,
            //fill: d => d[selfieSelector],
            // title: (d, i) => i > 0 ? ((d.Close - dji[i - 1].Close) / dji[i - 1].Close * 100).toFixed(1) : NaN,
            inset: 0.5,
            tip: {
              format: {
                date: true,
                "Photo Count": true,
                fy: false,
                x: false,
                y: false,
                fill: false,
              },
            },
          }),
        ],
      }}
    />
  {:else}
    <p>Waiting for data...</p>
  {/if}
</div>

<style>
  .radio-container {
    display: flex;
    /* //align-items: center; */
    gap: 10px;
    /* padding-left: 50px; */
    padding: 20px;
    align-items: center;

  }
  
  .radio-container label {
  margin-top: 3px; /* adjust this value as needed */
}
</style>
