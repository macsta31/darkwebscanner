import { json } from '@sveltejs/kit';

async function fetchPersonDetails(profileId:number) {
    const urlLookup = `https://api.rocketreach.co/api/v2/person/lookup?id=${profileId}`;
    const headers = {
        'Api-Key': '10dbd74ke95147686a4cb03f98fe0b92e0bf0c6d',
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(urlLookup, {
            method: 'GET',
            headers: headers,
        });
        const data = await response.json();
        const emails = data.emails;
        return emails;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error to be caught in the POST function
    }
}

export async function POST({ request }) {
    try {
        const { prospectId } = await request.json();
        const res = await fetchPersonDetails(prospectId);
        return json(res)
    } catch (error:any) {
        console.error('ERROR');
        console.error(error);
        return error
    }
}


