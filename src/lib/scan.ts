/**
 * @param {string} [searchParam]
 */
export async function scan(searchParam: string) {
    return fetch(`https://dw-proxy-server.vercel.app/api/breachedaccount?email=${searchParam}`)
        .then(response => response.json())
        .then(data => {
            // Sort data based on BreachDate
            if (data.length > 0) { 
                data.sort((a: { BreachDate: string | number | Date; }, b: { BreachDate: string | number | Date; }) => {
                    const dateA = new Date(a.BreachDate);
                    const dateB = new Date(b.BreachDate);

                    // Compare dates: if a is more recent, it will come later in the array
                    return dateA.getTime() - dateB.getTime();
                });
                return data;
            }
            else{
                return []
            }
        })
        .catch(error => {
            // console.error('Error:', error);
        });
}


export async function scanBatch(emails: string[]){
    const apiUrl = `https://dw-proxy-server.vercel.app/api/breachedaccountsbatch`
    // const apiUrl = 'http://localhost:3000/api/breachedaccountsbatch'
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emails: emails })
        });

        if (!response.ok) {
            throw new Error(`Server responded with a ${response.status} status.`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error calling the API:", error);
        return null;
    }
}
