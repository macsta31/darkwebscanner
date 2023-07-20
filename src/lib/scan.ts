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
