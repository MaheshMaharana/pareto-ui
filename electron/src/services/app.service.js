
export const updateScenario = (data) => {
    return fetch('http://paretodata.digitalglyde.com/update', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 