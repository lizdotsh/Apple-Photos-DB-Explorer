<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  import * as aq from "arquero";
  let filt;
  const ethnic = [
    "Black",
    "Asian",
    "White",
    "Pacific Islander",
    "other/unknown"]

  const eachEthnicityZero = ethnic.map(d => {
    return {'ethnicity_estimate': d, 'count': 0};
  })
  $: person_group_stats.then((data) => {
    console.log(data);
    filt  = aq
      .from(eachEthnicityZero.concat(data))
      .groupby("ethnicity_estimate")
      .rollup({ cnt: (d) => aq.op.sum(d.count) })
      .orderby("cnt")
      .ungroup()
      .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) });

    // face_expression_estimate

    //   console.log(df);
  }).catch((e) => {
        console.log(e);
      });
</script>

{#if filt}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: true },
      title: "Ethnicity",
      height: 250,
      color: {
        legend: true,
        domain: [
          "Black",
          "Asian",
          "White",
          "Pacific Islander",
          "other/unknown",
        ],
        label: "Detected Ethnicity",
      },
      y: {
        label: "Detected Ethnicity",
        domain: [
          "Black",
          "Asian",
          "White",
          "Pacific Islander",
          "other/unknown",
        ],
      },
      marginLeft: 110,
      marginRight: 40,

      marks: [
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
        //  sort: { y: "x", reverse: true },
        }),
        Plot.text(filt, {
          x: "pct",
          y: "ethnicity_estimate",
          text: (d) => `${(d.pct * 100).toFixed(0)}%`,
          dx: 15,
        }),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}
