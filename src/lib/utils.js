import { html } from 'htl';

export function styleTitle(title) {
  return html`<h2 style=${{ "padding-bottom": "2px", margin: "2px"}}>${title}</h2>`;
}