<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  export let start_date;
  export let end_date;
  import { styleTitle, genDateSubtitle } from "../utils.js";
</script>

{#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: false },
      title: styleTitle("Facial Hair"),
      subtitle: genDateSubtitle(start_date, end_date),
      height: 250,
      y: {
        label: "Facial Hair Type",
        domain: [
          "Beard",
          "Clean Shaven",
          "Goatee",
          "Mustache",
          "Stubble",
          "other/unknown",
        ],
      },
      color: {
        label: "Facial Hair Estimate",
        legend: true,
        domain: [
          "Beard",
          "Clean Shaven",
          "Goatee",
          "Mustache",
          "Stubble",
          "other/unknown",
        ],
      },
      marginLeft: 100,
      marginRight: 40,
      marks: [
        // Plot.barY(
        //     // filter by not no_name or no_face
        //     gender,

        //     {x: 'gender_estimate', y: 'cnt', tip: true, fill: 'gender_estimate', sort: {x: 'y', reverse: true}}),
        Plot.barX(person_group_stats.facial_hair_estimate, {
          x: "pct",
          y: "facial_hair_estimate",
          fill: "facial_hair_estimate",
          channels: {
            "Photo Count": "cnt",
          },
          tip: {
            format: {
              fill: true,
              x: (d) => `${d.toFixed(1)}%`,
              "Photo Count": true,
              y: false,
            },
          },
          label: true,
          sort: { y: "x", reverse: true },
        }),
        Plot.text(person_group_stats.facial_hair_estimate, {
          x: "pct",
          y: "facial_hair_estimate",
          text: (d) => `${d.pct.toFixed(0)}%`,
          dx: 15,
        }),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}
