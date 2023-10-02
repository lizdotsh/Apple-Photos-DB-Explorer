<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from './Plot.svelte';
    export let full_name;
    export let olap_table;
    import * as aq from "arquero";
  </script>
  
  {#if olap_table && full_name}
  <PlotRender options={{ 
    title: 'Photos of user over time',
    x: {label: 'User', line: true},
    y: {label: 'Number of Photos', line: true},
    marginLeft: 120,
    marks: [

        // Comparison over time 
        Plot.barX(
            // filter by not no_name or no_face
            olap_table.filter(
                d => d.full_name != 'no_name' && d.full_name != 'no_face')
                .orderby(aq.desc(d => d.count)),

            
            {y: 'full_name', x: 'count', tip: true, fill: 'full_name', sort: {y: 'x', reverse: true}})
    ], 
    }} />
{/if} 