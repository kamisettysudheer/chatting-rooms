const port = Deno.args[0];
const conn = await Deno.connect({ port });

const readResponse = async (conn) => {
  for await (const chunk of conn.readable) {
    console.log(new TextDecoder().decode(chunk));
  }
};

const sendRequest = async (conn) => {
  const writer = conn.writable.getWriter();

  for await (const chunk of Deno.stdin.readable) {
    const msg = new TextDecoder().decode(chunk);
    console.log(msg);
    writer.write(chunk);
  }
};

sendRequest(conn);
readResponse(conn);
