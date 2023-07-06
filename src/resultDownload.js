  /**
     * @param {Array<any>} leaks
     */
  function createHTMLDoc(leaks) {
    console.log(leaks);
    if (leaks) {
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
        <title>Data Display</title>
        </head>
        <body>
        <h1>Data Display</h1>
        `;

        leaks.forEach((element) => {
        let dataClasses = element.DataClasses.join(", ");
        let section = `
            <section>
            <h2>${element.Name}</h2>
            <p><strong>Title:</strong> ${element.Title}</p>
            <p><strong>Domain:</strong> ${element.Domain}</p>
            <p><strong>Breach Date:</strong> ${element.BreachDate}</p>
            <p><strong>Added Date:</strong> ${element.AddedDate}</p>
            <p><strong>Modified Date:</strong> ${element.ModifiedDate}</p>
            <p><strong>Pwn Count:</strong> ${element.PwnCount}</p>
            <p><strong>Description:</strong> ${element.Description}</p>
            <p><strong>Data Classes:</strong> ${dataClasses}</p>
            <p><strong>Is Verified:</strong> ${element.IsVerified}</p>
            <p><strong>Is Fabricated:</strong> ${element.IsFabricated}</p>
            <p><strong>Is Sensitive:</strong> ${element.IsSensitive}</p>
            <p><strong>Is Retired:</strong> ${element.IsRetired}</p>
            <p><strong>Is Spam List:</strong> ${element.IsSpamList}</p>
            <p><strong>Is Malware:</strong> ${element.IsMalware}</p>
            </section>
        `;
        html += section;
        });

        html += `
        </body>
        </html>
        `;

        return html;
    }
}


/**
 * @param {any[]} leaks
 */
export default function downloadData(leaks) {
    var data = JSON.stringify(leaks);
    var html = createHTMLDoc(leaks);
    if(html){

        var link = document.createElement("a");
        link.href = "data:text/html;charset=utf-8," + encodeURIComponent(html);
        link.download = "data.html";
        link.click();
    }
}
