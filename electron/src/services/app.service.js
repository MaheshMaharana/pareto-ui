
export const updateScenario = (data) => {
    return fetch('https://paretodata.digitalglyde.com/update', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 