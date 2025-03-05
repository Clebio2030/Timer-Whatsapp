export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { apiKey, instanceName } = req.query;
  
  try {
    const response = await fetch(`http://154.38.178.255:8081/instance/info?key=${apiKey}&id=${instanceName}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}