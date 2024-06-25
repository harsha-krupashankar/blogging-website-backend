const hashPassword = async (password: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const key = await crypto.subtle.digest(
        {
            name: "SHA-256",
        },
        data
    );
    const hashArray = Array.from(new Uint8Array(key));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
};

export default hashPassword;
