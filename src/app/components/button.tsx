"use client";
export function Button() {
    return (
        <div >
            <button
                onClick={() => {
                    const client: string = process.env.NEXT_PUBLIC_CLIENT_ID || "";
                    const random: string = process.env.NEXT_PUBLIC_RANDOM || "";
                    
                    if (!client || !random) {
                        console.error("Environment variables are missing.");
                        alert("Environment variables are not properly configured.");
                        return;
                    }
                    const encodedClient = encodeURIComponent(client);
                    const encodedRandom = encodeURIComponent(random);
                    window.location.href = `https://github.com/login/oauth/authorize?client_id=${encodedClient}&scope=repo,read:org,user&state=${encodedRandom}`;
                }}
                className="inline-flex lg:h-16 h-12 animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] lg:px-12 px-8 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
                Join the Crew!
            </button>
        </div>
    );
}
