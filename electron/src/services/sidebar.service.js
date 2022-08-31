

export const fetchScenarios = () => {
    return fetch('https://paretodata.digitalglyde.com/scenarios/', {
        method: 'GET', 
        mode: 'cors'
    });
}; 

export const uploadExcelSheet = (data) => {
    return fetch('https://paretodata.digitalglyde.com/upload', {
        method: 'POST', 
        mode: 'cors',
        body: data
    });
}; 



