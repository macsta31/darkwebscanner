import { json } from '@sveltejs/kit';
import { VITE_APIKEY, VITE_DOMAIN } from '$env/static/private';
import { supabase } from '$lib/supabaseClient.js';

const API_KEY = VITE_APIKEY;
const DOMAIN = VITE_DOMAIN;

import formData from 'form-data';
import Mailgun from 'mailgun.js';
function getMessageContent(scanResult: { Name: any; Title: any; Domain: any; BreachDate: any; PwnCount: any; Description: any; DataClasses: any[]; IsVerified: any; }[]){
  if(scanResult[0]?.Name){
    return scanResult.map((result: { Name: any; Title: any; Domain: any; BreachDate: any; PwnCount: any; Description: any; DataClasses: any[]; IsVerified: any; }) => {
      return `Name: ${result.Name}\nTitle: ${result.Title}\nDomain: ${result.Domain}\nBreach Date: ${result.BreachDate}\nPwn Count: ${result.PwnCount}\nDescription: ${result.Description}\nData Classes: ${result.DataClasses.join(', ')}\nIs Verified: ${result.IsVerified}\n\n`
    }).join('\n')
  }
  return "Good news! We found no evidence of your email address in any data leaks. Continue practicing safe online habits to keep your information secure."
}

async function sendMail(searchParam: any, scanResult: { Name: any; Title: any; Domain: any; BreachDate: any; PwnCount: any; Description: any; DataClasses: any[]; IsVerified: any; }[]) {
  const mailgun = new Mailgun(formData);
  const client = mailgun.client({username: 'api', key: API_KEY});

  const messageData = {
    from: 'ISAIX Dark Web Scanner <darkwebscanner@isaix.com>',
    to: searchParam,
    subject: `Dark Web Scan Results For ${searchParam}`,
    text: getMessageContent(scanResult)
  };

  return client.messages.create(DOMAIN, messageData)
    .then((res) => {
      console.log(res);
      return { 
        status: 200, 
        body: res
      };
    })
    .catch((err) => {
      console.error(err);
      return { 
        status: 500, 
        body: err.message
      };
    });
}

async function addDataClassesToDB(DataClasses:string[]){
  try {
    DataClasses.forEach(async (dataClass: string) => {
      const { data, error } = await supabase
      .from('DataClasses')
      .upsert([
        {Name: dataClass},
      ],
      {
        onConflict: 'Name'
      });
      
      if (error) {
        console.error('Error in addDataClassesToDB:', error.message);
      } else {
        console.log('addDataClassesToDB data:', data);
      }

      return {data, error};
    });
  } catch (error) {
    console.error('Error in addDataClassesToDB:', error);
  }
}

async function addBreachToDB(scanResult: { Name: any; Title: any; Domain: any; BreachDate: any; AddedDate: any; ModifiedDate: any; PwnCount: any; Description: any; DataClasses: any[]; LogoPath: any; IsVerified: any; IsFabricated: any; IsSensitive: any; IsSpamList: any; IsMalware: any; }[]){
  try{
    for (const result of scanResult) {
      await addDataClassesToDB(result.DataClasses);
      
      const { data, error } = await supabase
      .from('Breach')
      .upsert([
        {
          Name: result.Name,
          Title: result.Title,
          Domain: result.Domain,
          BreachDate: result.BreachDate,
          AddedDate: result.AddedDate,
          ModifiedDate: result.ModifiedDate,
          PwnCount: result.PwnCount,
          Description: result.Description,
          LogoPath: result.LogoPath,
          IsVerified: result.IsVerified,
          IsFabricated: result.IsFabricated,
          IsSensitive: result.IsSensitive,
          IsSpamList: result.IsSpamList,
          IsMalware: result.IsMalware,
        },
      ],
      {
        onConflict: 'Name'
      });

      if (error) {
        console.error('Error in addBreachToDB:', error.message);
      } else {
        console.log('addBreachToDB data:', data);
      }
    }

    return {'message': 'Success'};
  }
  catch (error) {
    console.error('Error in addBreachToDB:', error);
    return {'error': error};
  }
}




export async function POST({ request }) {
  const { searchParam, scanResult } = await request.json();
  const res = await sendMail(searchParam, scanResult);
  const retval = await addBreachToDB(scanResult)
  return json({retval})

}
