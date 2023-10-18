<script>
    import * as Plot from "@observablehq/plot";
    import { styleTitle } from './utils.js';
    export let options;
 //   if ('title' in options) {
    //options['title'] = styleTitle(options['title'])
  //  }
    function addChart(node) { node.appendChild(Plot.plot(options)); }
  </script>
 
 
  {#key options}
    <div use:addChart {...$$restProps} />
  {/key}