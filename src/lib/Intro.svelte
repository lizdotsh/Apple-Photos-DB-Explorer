<script>
    export let person; 
    export let people;

    // <!-- function getPerson(person_id) { -->
    //     // person = people[person_id];
    // // }
    // <!-- $: topPersonNotAll =  -->
</script>




<div class='instructions-flex'>
        <div class = 'text-intro-flex'>
    <div class='intro-section'>
        <h1> Hello {Object.values(people)[1]['full_name']}!<sup class="tooltip" title="If this is wrong, you have more photos of someone else than yourself :P">[?]</sup>
        
    </div>
    <div>
        <p>You currently have {person.full_name} selected.</p>

    </div>
    <div>
    <p>
        {#if person.full_name === "All Photos"}
        <b>You currently have no face/name selected.</b> Showing stats for all photos in your library (many face-specific stats may be meaningless)
        {/if}
        </p>
    </div>
   
        </div>

    <div class='instructions-div'> 
        <h3>Instructions:</h3>
        <p>1. Select a name from the dropdown menu above.</p>
        <p>2. Click on the tabs below the app title to see different visualizations.</p>
        <p>3. Hover over the visualizations to see more information.</p>
        <p>4. Use the date selector to scrub through the stats over time as you wish. You can also hit 'play' and have it automatically move it for you :)</p>

    </div>
<!-- 
    <div> 
        <h3>Stats:</h3>
    </div> -->

</div>


<style>
    .tooltip {
        position: relative;
        display: inline-block;
        /* border-bottom: 1px dotted black; */
        font-size: 12px;

    }

    .tooltip:hover::before {
        content: attr(title);
        position: absolute;
        top: -10px;
        left: 20px;
        /* background-color: #333; */
        /* color: #fff; */
        padding: 5px;
        width: 200px;
        border-radius: 50px;
    }
    .intro-section {
      text-align: center;
     

    }
    .instructions-flex {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
    }
    .text-intro-flex {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        max-width: 30%;
    }
    .instructions-div {
        max-width: 40%;
        margin-left: 20px;
    }

</style>