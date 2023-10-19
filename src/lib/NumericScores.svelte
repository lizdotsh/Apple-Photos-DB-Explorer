<script>
    export let person_numeric_scores;

    let use_global_scores = false;
    function toggleScores() {
        use_global_scores = !use_global_scores;
    }

</script>
{#if person_numeric_scores}

<div>
    <p>
        <label>
            <input type="checkbox" bind:checked={use_global_scores} >
            Ignore Name Selection <br>(Apply to all photos, not just those with a named face).
        </label>
    </p>

    <p>
        {#each Object.keys(person_numeric_scores) as score}
        <ul>
            <li>
                {score}: {person_numeric_scores[score]}
            </li>
        </ul>
        {/each}
    </p>
</div>

{/if}