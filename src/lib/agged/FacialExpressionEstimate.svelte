<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  export let date_range_string;
  import { styleTitle } from '../utils.js';
//   let filt;
//   $: person_group_stats.then((data) => {
//     filt = aq
//       .from(data)
//       .groupby(`face_expression_estimate`)
//       .rollup({ cnt: (d) => aq.op.sum(d.count) })
//       .orderby("cnt")
//       .ungroup()
//       .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) });

    // face_expression_estimate

    //   console.log(df);
//   }).catch((e) => {
//         console.log(e);
//       });
</script>

{#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: false },
      title: styleTitle('Facial Expression'),
      subtitle: date_range_string,
      height: 250,
      color: {
        label: "Facial Expression",
        legend: true,
        domain: [
          "Disgusted/Angry",
          "Happiness",
          "NA",
          "Neutral",
          "Sadness",
          "Surprised/Fearful",
          "Confident/Smirk",
        ],
      },
      y: {
        label: "Facial Expression Shown",
        domain: [
          "Disgusted/Angry",
          "Happiness",
          "NA",
          "Neutral",
          "Sadness",
          "Surprised/Fearful",
          "Confident/Smirk",
        ],
      },
      marginLeft: 120,
      marks: [
        Plot.barX(person_group_stats['face_expression_estimate'], {
          x: "pct",
          y: "face_expression_estimate",
          marginRight: 40,
          fill: "face_expression_estimate",
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
        Plot.text(person_group_stats['face_expression_estimate'], {
          x: "pct",
          y: "face_expression_estimate",
          text: (d) => `${(d.pct ).toFixed(0)}%`,
          fill: "black",
          dx: 15,
          //    font: "bold 12px var(--sans-serif)",
        }),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}
