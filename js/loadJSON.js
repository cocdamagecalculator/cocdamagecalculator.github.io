let defenseJSON = null;
let offenseJSON = null;
let otherJSON = null;

const initEvent = new Event("init");

async function fetchJSON() {
    try {
        const response1 = await fetch('/json/defense.json');
        if (!response1.ok) throw new Error('Failed to fetch data from defense.json');
        defenseJSON = await response1.json();
                
        const response2 = await fetch('/json/offense.json');
        if (!response2.ok) throw new Error('Failed to fetch data from offense.json');
        offenseJSON = await response2.json();

        const response3 = await fetch('/json/other.json');
        if (!response3.ok) throw new Error('Failed to fetch data from other.json');
        otherJSON = await response3.json();

        document.dispatchEvent(initEvent);
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/html/error.html'; // Redirect to an error page
    }
}

fetchJSON();