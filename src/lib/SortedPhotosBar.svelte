<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from './Plot.svelte';
    export let people_time;
    export let people;
    let names; 
    $: {
        if (people) {
            names = Object.values(people).map((e) => e.full_name);
            console.log({names});
        }
    } 

    // $: people_time.then((data) => {
    //   filt = data;
        
    // });

    // $: ((data) => {
    //     if (filt) {
    //     filt
    //     ?.params({person_id})
    //     ?.filter((d, $) => d.full_name === $.person_id);
    //     }
    // })(filt);


   // $: selected_count = filt?.objects()?.find((e) => e.person_uuid === elm_name)?.count ?? "N/A";
  </script>
  <h2> Number of Photos by person (all time)</h2> 
  {#if people_time}
  <PlotRender options={{ 
    x: {label: 'Name', line: true, tickRotate: -45},
    y: {label: 'Number of Photos', line: true},
    color: {
        domain: names,
    },
    marginBottom: 120,
    marginLeft: 50,
    marks: [
        Plot.barY(
            people_time,
            // filter by not no_name or no_face
            
            {x: 'full_name', y: 'count', tip: true, fill: 'full_name', sort: {x: 'y', reverse: true}})
    ], 
    }} />
{/if}