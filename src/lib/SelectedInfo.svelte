<script>
    export let name_count;
    export let elm_name;
    export let person;
    let filt;
    let selected_count;
    import * as aq from "arquero";
    function process_filt(flt, name){
        if (flt) {

        flt.then(d => {
            selected_count = aq.from(d)
            .params({name})
            .filter((d, $) => d.full_name === $.name)
            .rollup({count: aq.op.sum("count")})
            .objects()[0]?.count ?? "error"
        }).catch(e => {
            console.log(e)
        });
        }
    }
    $: process_filt(name_count, elm_name);
   

    $: console.log(selected_count, filt);
  </script>
  {#if selected_count && person}
  <div class = "flex-container-col">
    {selected_count} of {person?.count ?? "N/A"} photos selected.
  </div>

  
{/if} 

<style>
    .flex-container-col {
    box-sizing: border-box;
    width: 100%;
  }
</style>