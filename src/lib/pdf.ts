// @ts-nocheck
import pdfMake from "pdfmake/build/pdfmake";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function convertHtmlToPdfMake(html) {
    // Split the HTML content based on <a> tags
    const parts = html.split(/<a [^>]+>|<\/a>/gi);
    
    const content = [];
    parts.forEach((part, index) => {
        if (part.trim() === "") return;

        if (/<a [^>]+>/i.test(part)) {
            // Extract href value from the <a> tag
            const hrefMatch = part.match(/href="([^"]+)"/i);
            if (hrefMatch) {
                // Next part will be the link text
                const linkText = parts[index + 1];
                content.push({ text: linkText, link: hrefMatch[1], color: 'blue', decoration: 'underline' });
            }
        } else if (!/<a [^>]+>/i.test(parts[index - 1])) {
            // If this part is not a link and the previous part wasn't a starting <a> tag
            content.push(part);
        }
    });
    
    return content;
}


export async function generatePDF (jsonData){
    const content = [];
    content.push({ text: 'Data Breaches Report', style: 'title' });

    jsonData.forEach(item => {
        content.push({ text: `Email: ${item.email}`, style: 'email' });
        
        if (Array.isArray(item.breaches)) {
            item.breaches.forEach(breach => {
                content.push({ text: breach.Name, style: 'subheader' });
                content.push({ text: `Domain: ${breach.Domain}` });
                content.push({ text: `Breach Date: ${breach.BreachDate}` });
                
                const pdfMakeContent = convertHtmlToPdfMake(breach.Description);
                content.push({ text: pdfMakeContent, margin: [0, 10, 0, 10] });
                
                content.push({ text: 'Data Classes Affected:', bold: true });
                if (Array.isArray(breach.DataClasses)) {
                    breach.DataClasses.forEach(dataClass => {
                        content.push({ ul: [`${dataClass}`] });
                    });
                }
                content.push({ text: breach.IsVerified ? 'Verified' : 'Not Verified', style: 'verifiedStatus' });
                content.push({ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 }] }); // Horizontal line
            });
        } else {
            content.push({ text: 'No breaches for this email', style: 'noBreaches' });
        }
    });

    const docDefinition = {
        content: content,
        styles: {
            header: {
                fontSize: 24,
                bold: true,
                margin: [0, 0, 0, 20],
                color: '#007BFF'
            },
            subheader: {
                fontSize: 20,
                bold: true,
                margin: [0, 20, 0, 10],
                color: '#333'
            },
            error: {
                color: 'red',
                margin: [0, 0, 0, 0]
            },
            link: {
                fontSize: 14,
                color: 'blue',
                decoration: 'underline'
            },
            text: {
                fontSize: 14,
                margin: [0, 5, 0, 5]
            }
        }
    };
    
    
    return new Promise((resolve) => {
        pdfMake.createPdf(docDefinition).getBlob(resolve);
    });
}
