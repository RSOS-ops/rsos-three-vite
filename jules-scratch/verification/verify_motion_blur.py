from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the running application
    page.goto("http://localhost:5173")

    # Wait for the canvas to be ready
    page.wait_for_selector('canvas')

    # Give the scene time to load completely
    time.sleep(2)

    # Simulate a more significant camera movement
    page.mouse.move(200, 200)
    page.mouse.down()
    page.mouse.move(600, 400, steps=50)
    page.mouse.up()

    # Wait a moment for the blur to fully render
    page.wait_for_timeout(1000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)