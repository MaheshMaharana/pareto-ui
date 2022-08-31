
export const runModel = (data) => {
    return fetch('https://paretodata.digitalglyde.com/run_model/', {
        method: 'POST', 
        mode: 'cors',
        body: JSON.stringify(data)
    });
}; 