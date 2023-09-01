import { json } from '@sveltejs/kit';

async function fetchPersonDetails(profileId:number) {
    const urlLookup = 'https://api.rocketreach.co/api/v2/person/lookup';
    const headers = {
        'Api-Key': '10dbd74ke95147686a4cb03f98fe0b92e0bf0c6d',
        'Content-Type': 'application/json'
    };

    // Fetching additional data for each profile using the lookup API
    fetch(urlLookup, {
        method: 'GET',
        headers: headers,
        body: JSON.stringify({id: profileId})
    })
    .then(response => response.json())
    .then(data => {
        const emails = data.emails;
        console.log('Emails:');
        for (const email of emails) {
            console.log(email.email);
        }
        console.log('---');
    })
    .catch(error => console.error('Error:', error));
}


export async function POST({ request }) {
    const { prospectId } = await request.json();
    try{
        const res = await fetchPersonDetails(prospectId)
        // console.log(res)
        return json(res)
    }
    catch(error){
        console.error(error)
    }
    
  
}