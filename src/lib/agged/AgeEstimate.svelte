<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  import * as aq from "arquero";
//   let filt;
//   $: person_group_stats.then((data) => {
//     filt = aq
//       .from(data)
//       .groupby("age_estimate")
//       .rollup({ cnt: (d) => aq.op.sum(d.count) })
//       .orderby("cnt")
//       .ungroup()
//       .derive({ pct: (d) => d.cnt / aq.op.sum(d.cnt) });

    // face_expression_estimate

    //   console.log(df);
//   }).catch((e) => {
//         console.log(e);
//       });
    const ages = [
      "Infant/Toddler",
      "Toddler/Child",
      "Child/Young Adult",
      "Adult",
      "unknown",
    ];
    // $: console.log(person_group_stats?.age_estimate);
  //  $: person_group_stats['age_estimate'] = 
</script>

{#if person_group_stats}
  <PlotRender
    options={{
      x: { label: "Percent of selected photos", line: true, percent: false },
      marginRight: 40,
      title: "Age",
      height: 250,
      color: { legend: true, label: "Age Estimate", domain: ages },
      y: {
        label: "Detected Age Group",
        domain: ages,
      },
      marginLeft: 120,
      marks: [
        // Plot.barY(
        //     // filter by not no_name or no_face
        //     gender,

        //     {x: 'gender_estimate', y: 'cnt', tip: true, fill: 'gender_estimate', sort: {x: 'y', reverse: true}}),
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
