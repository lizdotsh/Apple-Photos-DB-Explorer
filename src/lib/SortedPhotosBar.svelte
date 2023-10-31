<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "./Plot.svelte";
  import { styleTitle, genDateSubtitle } from "./utils.js";
  export let people_time;
  export let people;
  export let person;
  let names;
  $: {
    if (people) {
      names = Object.values(people).map((e) => e.full_name);
      console.log({ names });
    }
  }

</script>

{#if people_time}
  <PlotRender
    options={{
      title: styleTitle("Number of Photos by person (all time)"),
      subtitle: genDateSubtitle(person?.start_date, person?.end_date),
      x: { label: "Name", line: true, tickRotate: -45 },
      y: { label: "Number of Photos", line: true },
      color: {
        domain: names,
      },
      height: 400,
      marginBottom: 120,
      marginLeft: 50,
      marks: [
        Plot.barY(
          people_time,

          {
            x: "full_name",
            y: "count",
            tip: true,
            fill: "full_name",
            sort: { x: "y", reverse: true },
          }
        ),
      ],
    }}
  />
{/if}
