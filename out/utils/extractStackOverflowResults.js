"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSnippetResults = void 0;
const linkedom_1 = require("linkedom");
// Extract and sort stackoverflow answers
function extractSnippetResults(options) {
    const doc = linkedom_1.parseHTML(options.textContent);
    const answersWithCodeBlock = Array.from(doc.window.document.querySelectorAll(".answer"))
        .filter((item) => item.querySelector("code") != null);
    const results = answersWithCodeBlock
        .map((item) => ({
        textContent: item.textContent,
        votes: parseInt(item.querySelector(".js-vote-count").textContent),
        // TODO: Handle answers with more than one code block
        // p/s: they often about explaining the something
        code: item.querySelector("code").textContent,
        sourceURL: item.querySelector(".js-share-link").href,
        hasCheckMark: item.querySelector("iconCheckmarkLg") != null
    }))
        .filter(item => isCodeValid(item.code));
    results.sort(sortSnippetResultFn);
    return { url: options.url, results };
}
exports.extractSnippetResults = extractSnippetResults;
function sortSnippetResultFn(a, b) {
    if (a.hasCheckMark != b.hasCheckMark) {
        return a.hasCheckMark ? 1 : -1;
    }
    const result = b.votes - a.votes;
    return result === 0 ? b.code.length - a.code.length : result;
}
// Check whether the input should be considered as code input or random text
function isCodeValid(input) {
    // This is just a temporary solution,
    // it would filter codes that are too short
    return input.length > 12;
}
