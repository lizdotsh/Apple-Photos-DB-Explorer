<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from './Plot.svelte';
        export let filt_tab;
    import * as d3 from "d3";  
    import * as aq from "arquero";
   $:{
        filt_tab = filt_tab.fold(['count', 'rolling_count'], {
            as: ["count_type","count_val"]
        });
        console.log(filt_tab);
    }
   
  </script>
  <input type="date" />

  {#if filt_tab}
  <PlotRender options={{ 
    title: 'Photos of user over time',
    x: {label: 'User', tickFormat: d3.format(".2s")},
    y: {label: 'Number of Photos', line: true},
    marginLeft: 120,
    marks: [



   Plot.lineY({filt_tab}, { x: "year_month", type: 'date'}, {y: "count_val", color: "count_type", tip: true, sort: {x: "x"} })
    ]   
    }}/>
{/if}