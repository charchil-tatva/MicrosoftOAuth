export function generateCodeVerifier(): string {
    const codeVerifierLength: number = 64; // Recommended length is 43-128 characters
    const characters: string =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier: string = '';

    for (let i: number = 0; i < codeVerifierLength; i++) {
        const randomIndex: number = Math.floor(Math.random() * characters.length);
        codeVerifier += characters.charAt(randomIndex);
    }

    return codeVerifier;
}

export async function calculateCodeChallenge(
    codeVerifier: string
): Promise<string> {
    const encoder: TextEncoder = new TextEncoder();
    const data: Uint8Array = encoder.encode(codeVerifier);
    const buffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray: number[] = Array.from(new Uint8Array(buffer));
    const codeChallenge: string = btoa(
        String.fromCharCode.apply(null, hashArray)
    )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    return codeChallenge;
}