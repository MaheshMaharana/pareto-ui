export const deleteScenario = (data) => {
    return fetch('https://paretodata.digitalglyde.com/delete_scenario/', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 