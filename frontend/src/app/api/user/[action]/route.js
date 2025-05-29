import axios from 'axios';

export async function POST(req, { params }) {
  const { action } = params;

  if (action !== 'login' && action !== 'register') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { login, password } = await req.json();

    const apiResponse = await axios.post(`http://localhost:3001/api/user/${action}`, { login, password });

    return new Response(JSON.stringify(apiResponse.data), { status: apiResponse.status });
  } catch (error) {
    return new Response('Error occurred: ' + error.message, { status: 500 });
  }
}
