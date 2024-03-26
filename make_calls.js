async function makeCalls(client) {
  const calls = await client.calls.create({
    twiml: `<Response>
    <Connect>
      <Stream url="wss://${process.env.SERVER}/connection" />
    </Connect>
  </Response>`,
    to: process.env.YOUR_NUMBER,
    from: process.env.FROM_NUMBER,
  });
  console.log("Calls: ", calls);
  return calls.sid;
}

export default makeCalls;
