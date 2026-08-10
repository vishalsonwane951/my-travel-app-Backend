export async function getLiveStation(fromStationCode, toStationCode, hours) {
  const url = new URL("https://irctc1.p.rapidapi.com/api/v3/getLiveStation");

  url.searchParams.set("fromStationCode", fromStationCode);
  url.searchParams.set("toStationCode", toStationCode);
  url.searchParams.set("hours", hours);

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "irctc1.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch (url.toString(), options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
    
  }
  return response.json()
}

