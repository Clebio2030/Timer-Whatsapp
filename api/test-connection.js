export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { apiKey, instanceName } = req.query;
  
  if (!apiKey || !instanceName) {
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }
  
  try {
    console.log(`Trying to connect to http://154.38.178.255:8081/instance/info?key=${apiKey}&id=${instanceName}`);
    
    const response = await fetch(`http://154.38.178.255:8081/instance/info?key=${apiKey}&id=${instanceName}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Verificar o tipo de conteúdo da resposta
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Se a resposta não for JSON, converter para objeto JSON para enviar ao cliente
      const text = await response.text();
      console.error('API responded with non-JSON content:', text);
      return res.status(500).json({ 
        success: false, 
        error: 'API responded with non-JSON content', 
        details: text.substring(0, 200) // Limitando o tamanho para evitar respostas enormes
      });
    }
    
    // Se chegamos aqui, a resposta é JSON
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error connecting to WhatsApp API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to WhatsApp API', 
      details: error.message 
    });
  }
}