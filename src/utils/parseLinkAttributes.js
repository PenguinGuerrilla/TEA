const parseLinkAttributes = (linkString) => {
    // 1. Check for valid input
    if (typeof linkString !== 'string' || linkString.trim() === '') {
        console.error("Invalid input: Please provide a non-empty string.");
        return null;
    }

    // 2. Create a temporary, in-memory DOM element to hold the string.
    // This avoids affecting the actual page DOM.
    const tempContainer = document.createElement('div');

    // 3. Assign the string to the container's innerHTML.
    // The browser's parser will automatically create the corresponding DOM nodes.
    tempContainer.innerHTML = linkString;

    // 4. Find the first anchor element ('a') within the temporary container.
    const anchorElement = tempContainer.querySelector('a');

    // 5. If an anchor element was found...
    if (anchorElement) {
        // ...extract the 'href' and 'refstr' attributes.
        const href = anchorElement.getAttribute('href');
        const refstr = anchorElement.getAttribute('refstr');

        // 6. Return the extracted data in an object.
        return {
            href,
            refstr
        };
    }
}
export default parseLinkAttributes;