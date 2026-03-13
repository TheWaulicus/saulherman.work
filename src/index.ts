export interface Env {}

const HEADERS = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// Handle CORS preflight
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: HEADERS });
		}

		if (url.pathname === "/api/location" && request.method === "GET") {
			const cf = (request as any).cf;
			const city = cf?.city || "Somewhere";
			const country = cf?.country || "Earth";
			const timezone = cf?.timezone || "UTC";

			return new Response(JSON.stringify({ city, country, timezone }), { headers: HEADERS });
		}

		if (url.pathname === "/api/terminal" && request.method === "POST") {
			try {
				const { command } = (await request.json()) as { command: string };
				const cmd = command.toLowerCase().trim();

				let output = "";

				switch (cmd) {
					case "whoami":
						output =
							"Saul Herman<br>Senior Client Platform Engineer at Atlassian.<br>Specializing in macOS/Windows fleet management and Zero Trust security.";
						break;
					case "skills":
						output = "<b>Platforms:</b> Jamf, Omnissa, Okta, Atlassian, Google Workspace<br><b>Languages:</b> Python, Bash, PowerShell, C++<br><b>Domains:</b> MDM, ZeroTrust, CIS Controls, SOC2, Onboarding Automation";
						break;
					case "contact":
						output = "Email: saulmherman@icloud.com<br>LinkedIn: linkedin.com/in/bettercallsaui<br>GitHub: github.com/thewaulicus";
						break;
					case "help":
						output = "Available commands:<br> - whoami: Brief bio<br> - skills: Technical skillset<br> - contact: Get in touch<br> - clear: Clear the terminal window<br> - help: Show this message";
						break;
					default:
						output = `Command not found: ${cmd}. Type 'help' for a list of available commands.`;
				}

				return new Response(JSON.stringify({ output }), { headers: HEADERS });
			} catch (e) {
				return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers: HEADERS });
			}
		}

		return new Response(JSON.stringify({ error: "Not Found" }), { status: 404, headers: HEADERS });
	},
};
