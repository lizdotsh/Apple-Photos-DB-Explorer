<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  export let date_range_string;
  import { styleTitle } from "../utils.js";
    const ages = [
      "Infant/Toddler",
      "Toddler/Child",
      "Child/Young Adult",
      "Adult",
      "unknown",
    ];
</script>

{#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: false },
      marginRight: 40,
      title: styleTitle("Age"),
      subtitle: date_range_string,
      height: 250,
      color: { legend: true, label: "Age Estimate", domain: ages },
      y: {
        label: "Detected Age Group",
        domain: ages,
      },
      marginLeft: 120,
      marks: [
        Plot.barX(person_group_stats['age_estimate'], {
          x: "pct",
          y: "age_estimate",
          fill: "age_estimate",
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
          sort: { y: "x", reverse: false },
        }),
        Plot.text(person_group_stats['age_estimate'], {
          x: "pct",
          y: "age_estimate",
          dx: 15,
          text: (d) => `${(d.pct).toFixed(0)}%`,
          //    dy: -5,
          fill: "black",
          align: "left",
        }),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}

   
<style>
    h2 {
        margin-bottom: 0.5rem;
        padding-bottom: 0.5rem;
    }
</style>