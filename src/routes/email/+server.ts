import { env } from '$env/dynamic/private';
// import Hello from '$lib/emails/EmailResults.svelte';
import nodemailer from 'nodemailer';
import { json } from '@sveltejs/kit';
import { VITE_EMAIL, VITE_PW } from '$env/static/private';


export async function POST({ request }) {
  const { searchParam, scanResult } = await request.json()
  // console.log(VITE_EMAIL, VITE_PW)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.VITE_EMAIL,
      pass: env.VITE_PW
    },
    port: 465, // Use port 465 for secure SMTP
    secure: true
  });

  // console.log(searchParam, scanResult)
  const mailOptions = {
    from: 'mackstathis@gmail.com',
    to: searchParam,
    subject: `Dark Web Scan Results For ${searchParam}`,
    text: scanResult.map((result: { Name: any; Title: any; Domain: any; BreachDate: any; PwnCount: any; Description: any; DataClasses: any[]; IsVerified: any; }) => {
      return `Name: ${result.Name}\nTitle: ${result.Title}\nDomain: ${result.Domain}\nBreach Date: ${result.BreachDate}\nPwn Count: ${result.PwnCount}\nDescription: ${result.Description}\nData Classes: ${result.DataClasses.join(', ')}\nIs Verified: ${result.IsVerified}\n\n`
    }).join('\n')
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return json('response')
}