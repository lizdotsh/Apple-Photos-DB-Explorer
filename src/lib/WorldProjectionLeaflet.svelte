<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "./Plot.svelte";
    export let latlong;
    import * as TopoJSON from "topojson-client";
    import L from 'leaflet';
    export let us;
    let latlong_here;
    let land_here;
    let states;

    import * as aq from "arquero";
   // let filt;
    let longitude = 90;
  
      // face_expression_estimate
  
      //   console.log(df);
 // $: console.log(latlong);
 //   $: console.log(land);
    $: {
        us.then((d) => {
            console.log(d);
            land_here = TopoJSON.feature(d, d?.objects?.nation);
            states = TopoJSON.feature(d, d?.objects?.states);
        });
    }
    $: latlong.then((d) => {
        console.log(d);
        latlong_here = d;
    });
  </script>
  
  {#if latlong_here && land_here}

    <input type="range" min=-180 max=180 bind:value={longitude} step = 1/>
    {latlong_here.length}
    <PlotRender
      options={{
          r: {range: [0, 16]},
//  projection: {type: "orthographic", rotate: [-longitude, -30]},
        projection: "albers",
  //r: {transform: (d) => Math.pow(10, d)}, // convert Richter to amplitude
  marks: [
    
    Plot.geo(states, {strokeOpacity: 0.5}),
    Plot.geo(land_here),
 //   Plot.density(latlong_here, {x: "longitude", y: "latitude", fill: "density", bandwith: 99999999})
  // Plot.dot(latlong_here, Plot.hexbin({r: "count", fill: "count"}, {x: "longitude", y: "latitude"}))
   Plot.dot(latlong_here, {x: "longitude", y: "latitude", fill: "red"})
  ]
}}
    />
  {:else}
    <p>Waiting for data...</p>
  {/if}
  