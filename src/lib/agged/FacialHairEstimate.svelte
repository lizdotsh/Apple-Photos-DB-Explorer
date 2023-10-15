<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte"
    export let person_group_stats;
    import * as aq from "arquero";
    let filt;
    $: person_group_stats.then((data) => {
  
      filt = aq
        .from(data)
        .groupby("facial_hair_estimate")
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
   title: "Facial Hair",
   height: 250,
   y: {
        label: "Facial Hair Type",
      domain: ['Beard', 'Clean Shaven', 'Goatee', 'Mustache', 'Stubble', 'other/unknown']
   },
   color: { legend: true , domain: ['Beard', 'Clean Shaven', 'Goatee', 'Mustache', 'Stubble', 'other/unknown']},
   marginLeft: 100,
   marginRight: 40,
   marks: [
     // Plot.barY(
     //     // filter by not no_name or no_face
     //     gender,

     //     {x: 'gender_estimate', y: 'cnt', tip: true, fill: 'gender_estimate', sort: {x: 'y', reverse: true}}),
     Plot.barX(filt, {
       x: "pct",
       y: "facial_hair_estimate",
       fill: "facial_hair_estimate",
       tip: true,
       label: true,
       sort: { y: "x", reverse: true },
     }),
     Plot.text(filt,{
        x: "pct",
        y: "facial_hair_estimate",
        text: (d) => `${((d.pct)*100).toFixed(0)}%`,
        dx: 15
     }),

   ],
 }}
/>
{:else}
 <p>Waiting for data...</p>
{/if}
