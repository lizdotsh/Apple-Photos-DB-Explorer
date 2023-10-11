<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from '../Plot.svelte';
    export let name_count;
    import * as aq from "arquero";
  </script>
  <h2> Number of Photos by person (all time)</h2> 
  {#if name_count}
  <PlotRender options={{ 
    x: {label: 'Name', line: true, tickRotate: -45},
    y: {label: 'Number of Photos', line: true},
    marginBottom: 120,
    marks: [
        Plot.barY(
            // filter by not no_name or no_face
            name_count.filter(
                d => d.full_name != 'no_name' && d.full_name != 'no_face')
                .orderby(aq.desc(d => d.count)),

            
            {x: 'full_name', y: 'count', tip: true, fill: 'full_name', sort: {x: 'y', reverse: true}})
    ], 
    }} />
{/if} 