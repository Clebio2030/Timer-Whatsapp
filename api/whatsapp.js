export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
  
  const { apiKey, instanceName, message, number } = req.body;
  
  if (!apiKey || !instanceName || !message || !number) {
    return res.status(400).json({ success: false, error: 'Missing required parameters' });
  }
  
  try {
    console.log(`Sending message to ${number} using instance ${instanceName}`);
    
    const response = await fetch(`http://154.38.178.255:8081/message/text?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: instanceName,
        message,
        number
      })
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
    console.error('Error sending WhatsApp message:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send WhatsApp message', 
      details: error.message 
    });
  }
}