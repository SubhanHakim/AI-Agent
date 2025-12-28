export async function terrasuck(input:string) {
    const res = await fetch('http://localhost:3001/api/terrasuck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
    })

    const data = await res.json();
    return data.output;
}