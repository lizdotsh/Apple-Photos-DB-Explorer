<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte";
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
  projection: {type: "orthographic", rotate: [-longitude, -30]},
  r: {transform: (d) => Math.pow(10, d)}, // convert Richter to amplitude
  marks: [
    Plot.geo(land, {fill: "currentColor", fillOpacity: 0.2}),
    Plot.sphere(),
    Plot.dot(earthquakes, {x: "longitude", y: "latitude", r: "magnitude", stroke: "red", fill: "red", fillOpacity: 0.2})
  ]
}}
    />
  {:else}
    <p>Waiting for data...</p>
  {/if}
  