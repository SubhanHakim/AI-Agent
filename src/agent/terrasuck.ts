export async function terrasuck(input: string, model?: string, systemPrompt?: string) {
    const res = await fetch('/api/terrasuck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input, model, systemPrompt })
    })

    const data = await res.json();
    return data.output;
}