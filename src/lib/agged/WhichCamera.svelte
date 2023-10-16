<script>
  import * as Plot from "@observablehq/plot";
  import PlotRender from "../Plot.svelte";
  export let person_group_stats;
  const dm = ["Front Camera", "Back Camera"];
</script>

{#if person_group_stats}
  <PlotRender
  
    options={{
      x: { label: "Percent of selected photos", percent: false },
      //correct capitalization
      title: "Camera",
      height: 100,
      color: {
        legend: true,
        type: "categorical",
        domain: dm,
        // range: ["#5778a4", "#6a9f58", "#f1a2a9"],
      },
      tip: {
        format: {
          name: true,
          fill: (d) => `${d}%`,
        },
      },
      marks: [
        Plot.barX(person_group_stats.which_camera, {
          x: "pct",
          fill: "which_camera",
          tip: {
            format: {
              x: (d) => `${d.toFixed(1)}%`,
            },
          },
          percent: true,
          order: dm,
          // sort: true,
        }),
        Plot.text(
          person_group_stats.which_camera,
          Plot.stackX({
            x: "pct",
            // fill: "gender_estimate",
            z: "which_camera",
            text: (d) => `${d.pct.toFixed(0)}%`,
            //center text
            lineAnchor: "middle",
            textAnchor: "middle",
            frameAnchor: "middle",
            percent: true,
            fill: "white",
            order: dm,
            //textAnchor: "middle",
          })
        ),
      ],
    }}
  />
{:else}
  <p>Waiting for data...</p>
{/if}
