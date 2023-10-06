<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let person_group_stats;
    import * as aq from "arquero";
    let filt;
    $: person_group_stats.then((data) => {
  
      filt = aq
        .from(data)
        .groupby("ethnicity_estimate")
        .rollup({ cnt: (d) => aq.op.sum(d.count) })
        .orderby("cnt")
        .ungroup()
        .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) });
    
      // face_expression_estimate
  
      //   console.log(df);
    });
  </script>
 {#if filt}
 <PlotRender
    options={{
      x: { label: "Percent of total", line: true, percent: true },
      color: {
        legend: true,
        domain: [
          "White",
          "Black/African American",
          "Asian",
          "Pacific Islander",
          "other/unknown",
        ],
        label: "Ethnicity",
      },
      y: {domain: [
          "White",
          "Black/African American",
          "Asian",
          "Pacific Islander",
          "other/unknown",
        ],},
      marginLeft: 210,
      marks: [
        // Plot.barY(
        //     // filter by not no_name or no_face
        //     gender,

        //     {x: 'gender_estimate', y: 'cnt', tip: true, fill: 'gender_estimate', sort: {x: 'y', reverse: true}}),
        Plot.barX(filt, {
          x: "pct",
          y: "ethnicity_estimate",
          fill: "ethnicity_estimate",
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
          sort: { y: "x", reverse: true },
        }),
      ],
    }}
  />
{:else}
 <p>Waiting for data...</p>
{/if}
