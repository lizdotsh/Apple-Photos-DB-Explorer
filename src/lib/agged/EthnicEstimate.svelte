<script>
    import * as Plot from "@observablehq/plot";
    import PlotRender from "../Plot.svelte";
    export let person_group_stats;
    export let start_date;
    export let end_date;
    import { styleTitle, genDateSubtitle } from "../utils.js";
    const ethnic = [
        "Black",
        "Asian",
        "White",
        "Pacific Islander",
        "other/unknown",
    ];

    const eachEthnicityZero = ethnic.map((d) => {
        return { ethnicity_estimate: d, count: 0, pct: 0 };
    });
    function fixthisshit(stats) {
        if (!stats) {
            return null;
        }
        const ethnic_estimate_stats = stats.map((d) => d.ethnicity_estimate);
        eachEthnicityZero.forEach((e) => {
            if (!ethnic_estimate_stats.includes(e.ethnicity_estimate)) {
                stats.push(e);
            }
        });
        return stats;
    }
    let filt;
    $: {
        if (person_group_stats) {
            filt = fixthisshit(person_group_stats?.ethnicity_estimate);
        }
    }
</script>

{#if filt}
    <PlotRender
        options={{
            x: {
                label: "Percent of selected photos",
                line: true,
                percent: false,
            },
            title: styleTitle("Ethnicity"),
            subtitle: genDateSubtitle(start_date, end_date),
            height: 250,
            color: {
                legend: true,
                domain: [
                    "Black",
                    "Asian",
                    "White",
                    "Pacific Islander",
                    "other/unknown",
                ],
                label: "Detected Ethnicity",
            },
            y: {
                label: "Detected Ethnicity",
                domain: [
                    "Black",
                    "Asian",
                    "White",
                    "Pacific Islander",
                    "other/unknown",
                ],
            },
            marginLeft: 110,
            marginRight: 40,

            marks: [
                Plot.barX(filt, {
                    x: "pct",
                    y: "ethnicity_estimate",
                    fill: "ethnicity_estimate",
                    channels: { "Photo Count": "cnt" },
                    tip: {
                        format: {
                            fill: true,
                            x: (d) => `${d.toFixed(1)}%`,
                            Count: true,
                            y: false,
                        },
                    },
                    label: true,
                    //  sort: { y: "x", reverse: true },
                }),
                Plot.text(filt, {
                    x: "pct",
                    y: "ethnicity_estimate",
                    text: (d) => `${d.pct.toFixed(0)}%`,
                    dx: 15,
                }),
            ],
        }}
    />
{:else}
    <p>Waiting for data...</p>
{/if}
