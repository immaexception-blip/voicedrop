import localtunnel from 'localtunnel';
import fs from 'fs';

(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log('TUNNEL_URL:' + tunnel.url);
    fs.writeFileSync('tunnel_url.txt', tunnel.url);
    
    tunnel.on('close', () => {
      console.log('tunnel closed');
    });
  } catch (err) {
    console.error('Tunnel error:', err);
  }
})();
