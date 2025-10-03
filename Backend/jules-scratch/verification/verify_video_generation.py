from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto("http://localhost:3000")

            # Click the generate button
            page.get_by_role("button", name="Generate Video").click()

            # Wait for the video to be visible
            video_player = page.locator("#video-player")
            expect(video_player).to_be_visible(timeout=15000) # Increased timeout for video generation

            # Take a screenshot
            page.screenshot(path="jules-scratch/verification/verification.png")

        except Exception as e:
            print(f"An error occurred: {e}")
            # Save a screenshot even on failure to help with debugging
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()