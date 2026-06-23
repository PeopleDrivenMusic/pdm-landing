import { VITE_GOOGLE_SHEETS_SPREADSHEET_WEB_URL } from '$env/static/private';

export async function POST({ request }) {
	const { email, role, scale, refCode, referredBy } = await request.json();

	const res = await fetch(VITE_GOOGLE_SHEETS_SPREADSHEET_WEB_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email,
			role,
			scale: scale ?? '',
			ref_code: refCode ?? '',
			referred_by: referredBy ?? ''
		})
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('Google Script returned:', text);
		return new Response(`Submission failed: ${text ?? 'Unknown error'}`, { status: 500 });
	}

	return new Response('OK', { status: 200 });
}
