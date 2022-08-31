export const deleteScenario = (data) => {
    return fetch('http://paretodata.digitalglyde.com/delete_scenario/', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 