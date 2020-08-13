// Function for getting access token
async function exchangeJwtForAccessToken(signedJwt) {
	var urlencoded = new URLSearchParams();
	urlencoded.append(
		'grant_type',
		'urn:ietf:params:oauth:grant-type:jwt-bearer'
	);
	urlencoded.append('assertion', signedJwt);

	var requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: urlencoded,
		redirect: 'follow'
	};
	let response = await fetch(
		'https://oauth2.googleapis.com/token',
		requestOptions
	);
	if (response.status !== 200) {
		throw Error(`accessToken status ${response.status}`);
	}
	let responseJson = await response.json();
	var acess_token = await responseJson.access_token;
	if (!acess_token) {
		throw Error(`Empty access_token ${JSON.stringify(responseJson)}`);
	}
	return acess_token;
}
