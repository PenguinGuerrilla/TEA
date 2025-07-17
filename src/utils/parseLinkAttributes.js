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

    // 4. Find all anchor elements ('a') within the temporary container.
    const anchorElements = tempContainer.querySelectorAll('a');

    // 5. Map over the NodeList of anchor elements to extract attributes.
    const attributesList = Array.from(anchorElements).map(anchor => {
        const href = anchor.getAttribute('href');
        const refstr = anchor.getAttribute('refstr');
        return { href, refstr };
    });

    // 6. Return the array of extracted attributes.
    // If no anchors were found, this will be an empty array.
    console.log("Extracted attributes:", attributesList);
    return attributesList;

    
}
export default parseLinkAttributes;