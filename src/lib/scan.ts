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


export async function scanBatch(emails: string[]) {
    const apiUrl = `https://dw-proxy-server.vercel.app/api/breachedaccountsbatch`;
    const batchSize = 3;
    const results: any[] = [];

    // Helper function to split array into batches
    function chunkArray(array: any[], chunkSize: number) {
        const results = [];
        while (array.length) {
            results.push(array.splice(0, chunkSize));
        }
        return results;
    }

    // Split emails into batches of 3
    const emailBatches = chunkArray(emails.slice(), batchSize);

    for (const emailBatch of emailBatches) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails: emailBatch })
            });

            if (!response.ok) {
                throw new Error(`Server responded with a ${response.status} status.`);
            }

            const data = await response.json();
            results.push(...data);  // Spread the results into the results array

        } catch (error:any) {
            console.error("Error calling the API:", error);
            results.push({ error: error.message, emails: emailBatch });  // Log error with the problematic batch for debugging
        }
    }

    return results;
}

