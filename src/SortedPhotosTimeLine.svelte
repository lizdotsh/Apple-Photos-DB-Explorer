<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from './Plot.svelte';
    export let chosen_name;
    export let olap_table;
    import * as aq from "arquero";
  import App from "./App.svelte";
    

  </script>
  
  {#if olap_table && chosen_name}
  
  <PlotRender options={{ 
    title: 'Photos of user over time',
    x: {label: 'User', line: true},
    y: {label: 'Number of Photos', line: true},
    marginLeft: 120,
    marks: [



        Plot.lineY(
    {olap_table},
            {x: 'year_month', y: 'count', stroke: 'full_name', tip: true, fill: 'full_name', sort: {y: 'x', reverse: true}})
    ], 
    }} />
{/if} 