import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    default: async ({request}) => {
        const data = await request.formData();
        const email = data.get('searchParam')
        try{
            const response = await fetch(`https://dw-proxy-server.vercel.app/api/breachedaccount?email=${email}`)
            const data = await response.json()

            if(!response.ok){
                return Error(data)
            }
            else{
                return data
            }
        }
        catch(error){
            return error
        }
    }
}