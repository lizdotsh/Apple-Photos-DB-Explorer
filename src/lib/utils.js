import { html } from "htl";

export function styleTitle(title) {
    return html`<h2 style=${{ "padding-bottom": "2px", margin: "2px" }}>
        ${title}
    </h2>`;
}

export function genDateSubtitle(start_date, end_date) {
    return html`<div
        style=${{
            "font-size": "13px",
            "padding-bottom": "5px",
            "padding-top": "0px",
            margin: "2px",
        }}
    >
        ${start_date?.slice(0, 7) ?? "error"} to
        ${end_date?.slice(0, 7) ?? "error"}
    </div>`;
}
