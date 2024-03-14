
export const readFileText = async (filePath,fileName) => {
    /**
     * Reads text content from a file and converts it into a File object.
     *
     * @param {string} filePath - The path or URL of the file to read.
     * @param {string} fileName - The desired name for the File object.
     * @returns {File|null} The File object created from the file content, or null if an error occurs.
     */
    try {
        // Fetch the file content as text
        const text = await fetch(filePath).then((res) => res.text());
        if (!text) return null
        // Convert the text into a Blob
        const blob = new Blob([text], { type: 'text/plain' });
        const file = new File([blob], fileName, { type: 'text/plain' });
        return file;
    } catch (e) {
        console.error(e);
        return null; // or throw an error as needed
    }
};