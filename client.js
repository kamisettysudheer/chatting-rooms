const port = Deno.args[0];
const conn = await Deno.connect({ port });

const readResponse = async (conn) => {
  try {
    for await (const chunk of conn.readable) {
      const msg = new TextDecoder().decode(chunk);
      // console.log(msg);
    }
  } catch {
    console.log("disconnected the server");
  }
};

const sendRequest = async (conn) => {
  const writer = conn.writable.getWriter();

  for await (const chunk of Deno.stdin.readable) {
    const msg = new TextDecoder().decode(chunk);
    if (msg.trim().toLowerCase() === "exit") break;
    console.log(msg);
    writer.write(chunk);
  }
  conn.close();
};

sendRequest(conn);
readResponse(conn);
