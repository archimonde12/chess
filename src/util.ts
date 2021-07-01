import { CONFIG_OPPONENT_URI } from "./config";

const sendRequestToServer = async () => {
    let res = await fetch(CONFIG_OPPONENT_URI, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: `
        query{
          testRequest
        }
      `,
      }),
    });
    const { data } = await res.json();
    console.log(data);
    return data;
  };