const port = Deno.args[0];
const listener = Deno.listen({ port });
const clients = new Map();
let clientId = 0;

const sendResponseToAll = (clientId, response) => {
  clients.forEach(async (value) => {
    const msg = `client ${clientId} : ${response}`;
    await value.write(new TextEncoder().encode(msg));
  });
};

const handleConnection = async (conn, clientId) => {
  clients.set(clientId, conn);

  for await (const chunk of conn.readable) {
    const req = new TextDecoder().decode(chunk);
    // const response = `client ${clientId} : ${req}`;
    const response = req;
    console.log(response);
    sendResponseToAll(clientId, response);
  }
};

for await (const conn of listener) {
  handleConnection(conn, clientId++);
}
