export async function terrasuck(input: string, image?: string | null, systemPrompt?: string) {
    const res = await fetch('/api/terrasuck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input, image, systemPrompt })
    })

    const data = await res.json();
    return data.output;
}