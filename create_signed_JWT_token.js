//Function for generating JWT token
async function generateJwtToken(settings) {
	// Permissions to request for Access Token
	let scopes = 'https://www.googleapis.com/auth/datastore';

	// Set how long this token will be valid in seconds
	let expiresIn = 120; // Expires in 2 minutes

	// Google Endpoint for creating OAuth 2.0 Access Tokens from Signed-JWT
	authUrl = 'https://www.googleapis.com/oauth2/v4/token';
	let issued = Math.floor(Date.now() / 1000);
	let expires = issued + expiresIn;
	// JWT Headers
	const additionalHeaders = {
		kid: settings.privateKeyId,
		alg: 'RS256',
		typ: 'JWT' // Google uses SHA256withRSA
	};

	var buff = new Buffer.from(JSON.stringify(additionalHeaders));
	let base64header = buff.toString('base64');

	// JWT Payload
	const payload = {
		iss: settings.clientEmail, // Issuer claim
		sub: settings.clientEmail, // Issuer claim
		aud: authUrl, // Audience claim
		iat: issued, // Issued At claim
		exp: expires, // Expire time
		scope: scopes // Permissions
	};

	var buff = new Buffer.from(JSON.stringify(payload));
	let base64payload = buff.toString('base64');

	// Defining the algorithm to be used
	const algo = 'RSA-SHA256';
	// Update private key line breaks
	const updatedPrivateKey = settings.privateKey.replace(/\\n/gm, '\n');
	// Creating Sign object
	var sign = crypto.createSign(algo);
	sign.update(base64header + '.' + base64payload);
	let signature = sign.sign(updatedPrivateKey, 'base64');

	let signedJwt = base64header + '.' + base64payload + '.' + signature;
	if (!signedJwt) {
		throw Error(`Empty JWT token`);
	}
	return signedJwt;
}
