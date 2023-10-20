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