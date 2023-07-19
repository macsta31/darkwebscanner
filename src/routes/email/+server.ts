import { json } from '@sveltejs/kit';
import { VITE_APIKEY, VITE_DOMAIN } from '$env/static/private';

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
    from: 'ISAIX Dark Web Scanner <donotreply@dw.isaix.com>',
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


export async function POST({ request }) {
  const { searchParam, scanResult } = await request.json();
  const res = await sendMail(searchParam, scanResult);
  return json({res})

}
