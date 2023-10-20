<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  export let start_date;
  export let end_date;
  import { styleTitle, genDateSubtitle } from "../utils.js";
  const tones = [
    "Black/Brown",
    "Brown/Blonde",
    "Brown/Red",
    "Red/White",
    "Artifical",
    "White/Bald",
    "other/unknown",
  ];
</script>

{#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: false },
      title: styleTitle("Hair Color"),
      subtitle: genDateSubtitle(start_date, end_date),
      height: 250,
      color: {
        legend: true,
        domain: tones,
        label: "Detected Skin Tone",
      },
      y: {
        label: "Detected Skin Tone",
        domain: tones,
      },
      marginLeft: 110,
      marginRight: 40,
      legend: {
        columns: 4,
      },
      marks: [
        Plot.barX(person_group_stats.hair_color_estimate, {
          x: "pct",
          y: "hair_color_estimate",
          fill: "hair_color_estimate",
          channels: { "Photo Count": "cnt" },
          tip: {
            format: {
              fill: true,
              x: (d) => `${d.toFixed(1)}%`,
              Count: true,
              y: false,
            },
          },
          label: true,
          //  sort: { y: "x", reverse: true },
        }),
        Plot.text(person_group_stats.hair_color_estimate, {
          x: "pct",
          y: "hair_color_estimate",
          text: (d) => `${d.pct.toFixed(0)}%`,
          dx: 15,
        }),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}
