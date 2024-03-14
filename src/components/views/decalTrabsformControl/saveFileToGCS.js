export const saveFileToGCS = async (inFileName, inData, inStoreName, inModificationId) => {
    let data = new FormData();
    // let currentTimestamp = new Date().getTime().toString()
    data.append('folder_name', process.env.REACT_APP_GCS_FOLDER_NAME + '-' + inModificationId);
    data.append('file_name', inFileName);
    data.append('company_name', inStoreName);

    // Create a Blob from the inDxfString
    const blob = new Blob([inData], { type: 'text/plain' });
    data.append('file_input', blob);


    let response = await fetch(process.env.REACT_APP_FILE_SAVE_API, {
        method: 'POST',
        body: data
    })

    let json = await response.json();
    return json.url
}
