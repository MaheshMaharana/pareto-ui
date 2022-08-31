

export const fetchScenarios = () => {
    return fetch('http://paretodata.digitalglyde.com/scenarios/', {
        method: 'GET', 
        mode: 'cors'
    });
}; 

export const uploadExcelSheet = (data) => {
    return fetch('http://paretodata.digitalglyde.com/upload', {
        method: 'POST', 
        mode: 'cors',
        body: data
    });
}; 



