<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let person_group_stats;
    import * as aq from "arquero";
    let filt;
    $: person_group_stats.then((data) => {
  
      filt = aq
        .from(data)
        .groupby(`face_expression_estimate`)
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
   x: { label: "Percent of Total", line: true, percent: true },

   color: { legend: true, label: "Age Estimate",
   
    domain: ['Disgusted/Angry', 'Happiness', 'NA', 'Neutral', 'Sadness', 'Surprised/Fearful', 'Confident/Smirk'],
 },
   y: {
    domain: ['Disgusted/Angry', 'Happiness', 'NA', 'Neutral', 'Sadness', 'Surprised/Fearful', 'Confident/Smirk'],
   },
   marginLeft: 120,
   marks: [
     // Plot.barY(
     //     // filter by not no_name or no_face
     //     gender,

     //     {x: 'gender_estimate', y: 'cnt', tip: true, fill: 'gender_estimate', sort: {x: 'y', reverse: true}}),
     Plot.barX(filt, {
       x: "pct",
       y: "face_expression_estimate",
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
   ],
 }}
/>
{:else}
 <p>Waiting for data...</p>
{/if}
