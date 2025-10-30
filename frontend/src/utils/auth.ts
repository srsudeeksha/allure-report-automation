export function getStoredToken(): string | null {
  // ✅ Use sessionStorage instead of localStorage
  return sessionStorage.getItem('token');
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const payloadJson = JSON.parse(atob(payloadBase64));
    const exp: number | undefined = payloadJson?.exp;
    if (!exp) return false; // require exp to exist
    const nowSeconds = Math.floor(Date.now() / 1000);
    return exp > nowSeconds;
  } catch {
    return false;
  }
}

export function isAuthenticated(): boolean {
  return isTokenValid(getStoredToken());
}