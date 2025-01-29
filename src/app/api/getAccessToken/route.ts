import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export  async function GET(req:NextRequest) {
    const url = new URL(req.url);
  const code = url.searchParams.get('code');


  const data = {
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    client_secret: process.env.client_secret,
    code: code,
    state: process.env.NEXT_PUBLIC_RANDOM
  };

  try {
    const response = await axios.post('https://github.com/login/oauth/access_token', data, {
      headers: {
        Accept: 'application/json',
      },
    });
    console.log(response)
    const token =response.data.access_token
    return NextResponse.json({token});
  } catch (error) {
    return NextResponse.json({ error: error});
  }
}