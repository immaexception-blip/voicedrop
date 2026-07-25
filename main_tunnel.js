import localtunnel from 'localtunnel';
import fs from 'fs';

async function main() {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    fs.writeFileSync('public_tunnel.txt', tunnel.url, 'utf8');
    console.log('PUBLIC_TUNNEL_URL: ' + tunnel.url);
  } catch (err) {
    fs.writeFileSync('public_tunnel.txt', 'Error: ' + err.message, 'utf8');
  }
}
main();
