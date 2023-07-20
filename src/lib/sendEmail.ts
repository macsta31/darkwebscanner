export default async function sendEmail(searchParam:string, scanResult:any[]) {
    const response = await fetch("/email", {
      method: "POST",
      body: JSON.stringify({ searchParam, scanResult }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
  }