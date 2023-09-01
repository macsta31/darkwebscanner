import { json } from '@sveltejs/kit';



const API_URL = 'https://api.rocketreach.co/v2/api/search';

async function searchRocketReach(employer:string) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Api-Key': '10dbd74ke95147686a4cb03f98fe0b92e0bf0c6d',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                page_size: 100,

                query: {
                    current_employer: [employer]
                }
            })
        });
        console.log(response)

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data
    } catch (error:any) {
        console.error("There was a problem with the fetch operation:", error.message);
    }
}

function fetchPersonDetails(profileId:number) {
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

// Example usage:
// fetchPersonDetails(someProfileId);


export async function POST({ request }) {
    const { employer } = await request.json();
    try{
        const res = await searchRocketReach(employer)
        // console.log(res)
        return json(res)
    }
    catch(error){
        console.error(error)
    }
    
  
}