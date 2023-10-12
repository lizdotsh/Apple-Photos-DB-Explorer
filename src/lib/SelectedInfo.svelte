<script>
    export let name_count;
    export let elm_name;
    export let names_ids;
    let filt;
    let selected_count;
    import * as aq from "arquero";

    $: name_count.then((d) => {
        filt = aq.from(d)
    })
    $: selected_count = filt
    ?.params({elm_name})
    ?.filter((d, $) => d.full_name === $.elm_name)
    ?.rollup({count: aq.op.sum("count")})
    ?.objects()[0]?.count ?? "error"

    $: console.log(selected_count, filt);
  </script>
  {#if filt}
    
  <h2>
    You have selected {elm_name}, they have {names_ids?.find(
      (e) => e?.full_name === elm_name
    )?.count ?? "N/A"} Photos total. You have selected {selected_count} photos.
  </h2>

  
{/if} 