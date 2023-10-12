<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from '../Plot.svelte';
    export let name_count;
    export let elm_name;
    let filt;
    let selected_count;
    import * as aq from "arquero";

    $: name_count.then((d) => {
        filt = aq.from(d)
    })
    $: selected_count = filt?.objects()?.find((e) => e.full_name === elm_name)?.count ?? "N/A";
  </script>
  <h2> Number of Photos by person (all time)</h2> 
  {#if filt}
  <h2>
    You have selected {elm_name}, they have {selected_count} Photos!
  </h2>
  <PlotRender options={{ 
    x: {label: 'Name', line: true, tickRotate: -45},
    y: {label: 'Number of Photos', line: true},
    marginBottom: 120,
    marks: [
        Plot.barY(
            // filter by not no_name or no_face
            filt,

            
            {x: 'full_name', y: 'count', tip: true, fill: 'full_name', sort: {x: 'y', reverse: true}})
    ], 
    }} />
{/if} 