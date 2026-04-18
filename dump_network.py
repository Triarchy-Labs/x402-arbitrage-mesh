from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        requests = []
        def handle_response(response):
            headers = response.headers
            size = headers.get('content-length', headers.get('Content-Length', '0'))
            ctype = headers.get('content-type', headers.get('Content-Type', ''))
            requests.append({'url': response.url, 'size': size, 'type': ctype})
            
            # If it's a large JSON or text file, let's download it
            if 'json' in ctype or 'javascript' in ctype or 'blob' in ctype:
                pass
                
        page.on("response", handle_response)
        page.goto("https://fine-n7vljkp34f.peachworlds.com/", wait_until="networkidle")
        page.wait_for_timeout(3000)
        
        with open("network_dump.json", "w") as f:
            json.dump(requests, f, indent=2)
            
        print("Captured", len(requests), "requests.")
        browser.close()

run()
