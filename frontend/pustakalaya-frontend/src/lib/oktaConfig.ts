export const oktaConfig = {
    clientId: '0oagnea7fxzzWK9OR5d7',
    issuer: 'http://dev-67181350.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
}
