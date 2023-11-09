<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte";
    export let person_group_stats;
    export let start_date;
    export let end_date;
    import { styleTitle, genDateSubtitle } from "../utils.js";
    const dm = ["No Glasses", "Eye Glasses", "Sun Glasses", "unknown"];
</script>

{#if person_group_stats}
    <PlotRender
        options={{
            x: { label: "Percent of selected photos", percent: false },
            //correct capitalization
            title: styleTitle("Glasses"),
            subtitle: genDateSubtitle(start_date, end_date),
            height: 100,
            color: {
                legend: true,
                type: "categorical",
                domain: dm,
            },
            tip: {
                format: {
                    name: true,
                    fill: (d) => `${d}%`,
                },
            },
            marks: [
                Plot.barX(person_group_stats.glasses_estimate, {
                    x: "pct",
                    fill: "glasses_estimate",
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
                    person_group_stats.glasses_estimate,
                    Plot.stackX({
                        x: "pct",
                        // fill: "gender_estimate",
                        z: "glasses_estimate",
                        text: (d) => `${d.pct.toFixed(0)}%`,
                        //center text
                        lineAnchor: "middle",
                        textAnchor: "middle",
                        frameAnchor: "middle",
                        percent: true,
                        fill: "white",
                        order: dm,
                        //textAnchor: "middle",
                    }),
                ),
            ],
        }}
    />
{:else}
    <p>Waiting for data...</p>
{/if}
